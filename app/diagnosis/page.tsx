'use client';
import type * as OrtType from 'onnxruntime-web';
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Brain, Camera, AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react";

/* ===================== ORT PRELOAD (trước khi import) ===================== */
const ortPromise: Promise<typeof import('onnxruntime-web')> = (async () => {
  if (typeof window !== 'undefined') {
    (globalThis as any).ortWasm = {
      wasmPaths: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/',
      numThreads: 1,
      simd: false,
    };
    console.log('preload ORT cfg', (globalThis as any).ortWasm);
  }
  return import('onnxruntime-web');
})();


/* ===================== UI/Types ===================== */
interface DiagnosisResult {
  riskLevel: "low" | "moderate" | "high";
  confidence: number;
  findings: string[];
  recommendations: string[];
  nextSteps: string[];
}

/* ===================== Utils ===================== */
function softmax(input: number[] | Float32Array): number[] {
  const arr = Array.from(input);
  const m = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - m));
  const s = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / s);
}

async function preprocessImage(file: File): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") img.src = reader.result;
      else reject("Could not read image");
    };
    reader.onerror = () => reject("Error reading image file");
    reader.readAsDataURL(file);

    img.onload = () => {
      const target = 224;
      const scale = Math.max(target / img.width, target / img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Could not create canvas context");

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const sx = Math.floor((w - target) / 2);
      const sy = Math.floor((h - target) / 2);
      const { data } = ctx.getImageData(sx, sy, target, target);

      const float32 = new Float32Array(3 * target * target);
      const mean = [0.485, 0.456, 0.406];
      const std  = [0.229, 0.224, 0.225];
      const area = target * target;

      for (let i = 0; i < area; i++) {
        const r = data[i * 4] / 255;
        const g = data[i * 4 + 1] / 255;
        const b = data[i * 4 + 2] / 255;
        float32[i]          = (r - mean[0]) / std[0];
        float32[i + area]   = (g - mean[1]) / std[1];
        float32[i + area*2] = (b - mean[2]) / std[2];
      }
      resolve(float32);
    };

    img.onerror = () => reject("Could not load image");
  });
}

// HEAD check (ngưỡng hợp lý ~1MB, đừng để quá cao)
async function ensureHead(url: string, minMB = 1) {
  const r = await fetch(url, { method: 'HEAD', cache: 'no-store' });
  if (!r.ok) throw new Error(`Không truy cập được model: ${r.status} ${r.statusText}`);
  const len = Number(r.headers.get('content-length') || 0);
  if (len < minMB * 1024 * 1024) throw new Error(`Model quá nhỏ (${len} bytes)`);
}

// Prefetch model (ngưỡng tối thiểu ~200KB để bắt lỗi file rỗng)
async function fetchModelBytes(url: string, tries = 3): Promise<Uint8Array> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) throw new Error(`Fetch model fail: ${r.status} ${r.statusText}`);
      const buf = await r.arrayBuffer();
      const bytes = new Uint8Array(buf);
      if (bytes.byteLength < 200 * 1024) {
        throw new Error(`Model quá nhỏ: ${bytes.byteLength} bytes`);
      }
      return bytes;
    } catch (e) {
      lastErr = e;
      await new Promise(res => setTimeout(res, 600 * (i + 1)));
    }
  }
  throw lastErr;
}

/* ===================== Page ===================== */
export default function DiagnosisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<OrtType.InferenceSession | null>(null);

  // cleanup preview URL
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);
      setAnalysisProgress(0);
      setIsAnalyzing(false);
      setPreviewUrl(URL.createObjectURL(file));
    } else if (!selectedFile) {
      setSelectedFile(null);
      setResult(null);
      setError(null);
      setAnalysisProgress(0);
      setIsAnalyzing(false);
      setPreviewUrl(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an image file to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);
    setResult(null);

    // Progress giả lập
    let running = true;
    const startTime = performance.now();
    (async () => {
      while (running) {
        const elapsed = performance.now() - startTime;
        const est = Math.min(95, 10 + elapsed / 20);
        setAnalysisProgress(est);
        await new Promise(r => setTimeout(r, 120));
      }
    })();

    try {
      // 1) Import ORT (đảm bảo đã preload)
      const ort = await ortPromise;

      // 2) ÉP lại env ngay trước khi tạo session (an toàn với HMR)
      (ort.env.wasm as any).wasmUrls = (globalThis as any).ortWasm.wasmUrls;
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.simd = false;
       ort.env.wasm.wasmPaths = '/ort/'; // optional khi đã map wasmUrls

      console.log('ORT env after import', {
        wasmPaths: ort.env.wasm.wasmPaths,
        numThreads: ort.env.wasm.numThreads,
        simd: ort.env.wasm.simd,
        // @ts-ignore
        wasmUrls: (ort.env.wasm as any).wasmUrls,
      });

      // 3) Kiểm tra & load model
      const MODEL_URL = '/models/ConvNeXtV2_v2.onnx';
      await ensureHead(MODEL_URL, 1);
      if (!sessionRef.current) {
        const modelBytes = await fetchModelBytes(MODEL_URL, 3);
        sessionRef.current = await ort.InferenceSession.create(modelBytes, {
          executionProviders: ['wasm'],
        });
      }
      const session = sessionRef.current!;

      // 4) Tiền xử lý ảnh
      const imageData = await preprocessImage(selectedFile);
      const inputTensor = new ort.Tensor('float32', imageData, [1, 3, 224, 224]);

      // 5) Chạy inference
      const outputs = await session.run({ [session.inputNames[0]]: inputTensor });
      const logits = outputs[session.outputNames[0]].data as Float32Array;
      const probabilities = softmax(logits);

      // 6) Mapping class 
      const classNames = [ 'benign','malignant',];
      const maxP = Math.max(...probabilities);
      const predictedIndex = probabilities.indexOf(maxP);
      const prediction = classNames[predictedIndex];
      const confidence = parseFloat((maxP * 100).toFixed(2));

      const newResult: DiagnosisResult = {
        riskLevel: prediction === 'malignant' ? 'high' : 'low',
        confidence,
        findings: [],
        recommendations: [],
        nextSteps: [],
      };

      if (prediction === 'malignant') {
        newResult.findings = [
          'AI analysis indicates a high probability of malignancy.',
          'Significant irregularities in shape, border, or color were detected.',
          'Immediate medical consultation is crucial.',
        ];
        newResult.recommendations = [
          'Schedule an urgent appointment with a certified dermatologist.',
          'Avoid any manipulation or self-treatment of the lesion.',
          'Protect the area from sun exposure.',
        ];
        newResult.nextSteps = [
          'Book a biopsy appointment as recommended by a specialist.',
          'Gather relevant medical history for your doctor.',
          'Monitor for rapid changes in the lesion.',
        ];
      } else {
        newResult.findings = [
          'AI analysis suggests a benign (non-cancerous) lesion.',
          'Characteristics appear consistent with a common mole or benign growth.',
          'No immediate signs of concern were identified.',
        ];
        newResult.recommendations = [
          'Continue routine self-skin checks.',
          'Practice sun safety (sunscreen, protective clothing).',
          'Consult a dermatologist if you notice any changes or have concerns.',
        ];
        newResult.nextSteps = [
          'Schedule annual skin examinations with a dermatologist.',
          'Keep digital photos for comparison over time.',
          'Educate yourself on skin cancer prevention.',
        ];
      }

      if (confidence < 70) {
        newResult.riskLevel = 'moderate';
        newResult.findings.push('Note: AI confidence is moderate. Human expert review is recommended.');
        newResult.recommendations.push('Consider seeking a second opinion or additional tests.');
      }

      // 7) Kết thúc
      running = false;
      setAnalysisProgress(100);
      setResult(newResult);
    } catch (err: any) {
      running = false;
      setAnalysisProgress(0);
      console.error('Error running analysis:', err);
      setError(err.message || 'Unknown error during model analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low": return <CheckCircle className="w-5 h-5" />;
      case "moderate": return <Info className="w-5 h-5" />;
      case "high": return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "border-green-300 bg-green-50 text-green-800";
      case "moderate": return "border-yellow-300 bg-yellow-50 text-yellow-800";
      case "high": return "border-red-300 bg-red-50 text-red-800";
      default: return "border-gray-300 bg-gray-50 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">AI Skin Cancer Diagnosis</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload a clear image of your skin concern for instant AI-powered analysis
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Upload Your Image
            </CardTitle>
            <CardDescription>
              For best results, ensure good lighting and the area fills most of the frame
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="space-y-4">
                    {/* Full Image Scan Container */}
                    <div className="scan-container">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-xs max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      {isAnalyzing && (
                        <>
                          {/* Dark overlay for scanning effect */}
                          <div className="scan-overlay" />
                          
                          {/* Horizontal scanning beam */}
                          <div className="scan-beam-horizontal" />
                          
                          {/* Vertical scanning beam */}
                          <div className="scan-beam-vertical" />
                          
                          {/* Corner scanning indicators */}
                          <div className="scan-corner scan-corner-tl" />
                          <div className="scan-corner scan-corner-tr" />
                          <div className="scan-corner scan-corner-bl" />
                          <div className="scan-corner scan-corner-br" />
                          
                          {/* Scanning grid effect */}
                          <div className="scan-grid" />
                          
                          {/* Pulsing center indicator */}
                          <div className="scan-center-pulse" />
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)} KB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-blue-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">JPEG, PNG files up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && !isAnalyzing && !result && (
                <Button onClick={handleAnalyze} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  <Brain className="w-5 h-5 mr-2" />
                  Analyze with AI
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {isAnalyzing && (
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">AI Analysis in Progress</h3>
                <p className="text-gray-600">Our advanced algorithms are analyzing your image...</p>
                <div className="max-w-md mx-auto">
                  <Progress value={analysisProgress} className="h-3" />
                  <p className="text-sm text-gray-500 mt-2">{Math.round(analysisProgress)}% Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
                    <div className={`p-4 rounded-lg border ${getRiskColor(result.riskLevel)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {getRiskIcon(result.riskLevel)}
                        <span className="font-semibold capitalize">{result.riskLevel} Risk</span>
                      </div>
                      <p className="text-sm">Confidence: {result.confidence}%</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Findings</h4>
                    <ul className="space-y-2">
                      {result.findings.map((finding, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Immediate Actions</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Next Steps</h4>
                    <ul className="space-y-2">
                      {result.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Important:</strong> This AI analysis is for screening purposes only and should not replace
                professional medical advice. Please consult with a qualified dermatologist for definitive diagnosis and treatment recommendations.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-6">
                Book Doctor Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setSelectedFile(null);
                  setResult(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setError(null);
                  setAnalysisProgress(0);
                  setIsAnalyzing(false);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="px-8 py-6"
              >
                Analyze Another Image
              </Button>
            </div>
          </div>
        )}

        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader><CardTitle>Tips for Better Results</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Photo Guidelines</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use natural lighting when possible</li>
                  <li>• Keep the camera steady and in focus</li>
                  <li>• Fill the frame with the area of concern</li>
                  <li>• Avoid shadows or reflections</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">What to Look For</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Changes in size, shape, or color</li>
                  <li>• Irregular or asymmetrical borders</li>
                  <li>• Multiple colors within one spot</li>
                  <li>• Diameter larger than 6mm</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced CSS for comprehensive scanning effects */}
      <style jsx>{`
        .scan-container {
          position: relative;
          display: inline-block;
        }

        /* Dark overlay */
        .scan-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 30, 60, 0.4);
          border-radius: 0.5rem;
          pointer-events: none;
          animation: scan-overlay-pulse 2s ease-in-out infinite;
        }

        /* Horizontal scanning beam */
        .scan-beam-horizontal {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            to right,
            rgba(0, 150, 255, 0) 0%,
            rgba(0, 150, 255, 0.8) 50%,
            rgba(0, 150, 255, 0) 100%
          );
          box-shadow: 0 0 10px rgba(0, 150, 255, 0.8);
          animation: scan-horizontal 1.5s linear infinite;
          pointer-events: none;
          z-index: 10;
        }

        /* Vertical scanning beam */
        .scan-beam-vertical {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(
            to bottom,
            rgba(255, 150, 0, 0) 0%,
            rgba(255, 150, 0, 0.8) 50%,
            rgba(255, 150, 0, 0) 100%
          );
          box-shadow: 0 0 10px rgba(255, 150, 0, 0.8);
          animation: scan-vertical 1.8s linear infinite;
          pointer-events: none;
          z-index: 10;
        }

        /* Corner indicators */
        .scan-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #00ff88;
          border-radius: 2px;
          pointer-events: none;
          z-index: 10;
          animation: scan-corner-blink 0.8s ease-in-out infinite;
        }

        .scan-corner-tl {
          top: 8px;
          left: 8px;
          border-right: none;
          border-bottom: none;
        }

        .scan-corner-tr {
          top: 8px;
          right: 8px;
          border-left: none;
          border-bottom: none;
        }

        .scan-corner-bl {
          bottom: 8px;
          left: 8px;
          border-right: none;
          border-top: none;
        }

        .scan-corner-br {
          bottom: 8px;
          right: 8px;
          border-left: none;
          border-top: none;
        }

        /* Scanning grid */
        .scan-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          animation: scan-grid-move 3s linear infinite;
          z-index: 5;
        }

        /* Center pulsing indicator */
        .scan-center-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: rgba(255, 0, 100, 0.8);
          border-radius: 50%;
          pointer-events: none;
          animation: scan-center-pulse 1s ease-in-out infinite;
          z-index: 15;
        }

        /* Animations */
        @keyframes scan-horizontal {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @keyframes scan-vertical {
          0% { left: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        @keyframes scan-corner-blink {
          0%, 50% { opacity: 1; box-shadow: 0 0 5px #00ff88; }
          25%, 75% { opacity: 0.3; box-shadow: none; }
        }

        @keyframes scan-grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, 20px); }
        }

        @keyframes scan-center-pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
            box-shadow: 0 0 5px rgba(255, 0, 100, 0.8);
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.4;
            box-shadow: 0 0 15px rgba(255, 0, 100, 0.4);
          }
        }

        @keyframes scan-overlay-pulse {
          0%, 100% { background: rgba(0, 30, 60, 0.4); }
          50% { background: rgba(0, 30, 60, 0.2); }
        }
      `}</style>
    </div>
  );
}