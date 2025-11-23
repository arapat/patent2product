'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Patent } from '@/lib/types';
import { MOCK_PATENTS } from '@/lib/constants';
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, Cpu, Zap, AlertCircle, FileText, ExternalLink, Eye, X, Download } from 'lucide-react';
import Image from 'next/image';
import GlassCard from '@/components/GlassCard';
import dynamic from 'next/dynamic';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Dynamically import PDF components to avoid SSR issues
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

// Set worker for PDF.js
if (typeof window !== 'undefined') {
  import('react-pdf').then((pdfjs) => {
    pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
  });
}

enum GenerationStatus {
  IDLE = 'idle',
  PREPARING = 'preparing',
  GENERATING = 'generating',
  UPLOADING = 'uploading',
  COMPLETE = 'complete',
  ERROR = 'error',
}

interface GenerationStep {
  status: GenerationStatus;
  label: string;
  description: string;
}

export default function PrototypePage() {
  const params = useParams();
  const router = useRouter();
  const patentId = params.id as string;

  const [patent, setPatent] = useState<Patent | null>(null);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [showPdf, setShowPdf] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const steps: GenerationStep[] = [
    {
      status: GenerationStatus.PREPARING,
      label: 'Analyzing Patent',
      description: 'Extracting key features and specifications',
    },
    {
      status: GenerationStatus.GENERATING,
      label: 'Generating Prototype',
      description: 'Creating visual representation using AI',
    },
    {
      status: GenerationStatus.UPLOADING,
      label: 'Finalizing',
      description: 'Processing and storing your prototype',
    },
  ];

  useEffect(() => {
    // Find patent by ID
    const foundPatent = MOCK_PATENTS.find(p => p.id === patentId);
    if (foundPatent) {
      setPatent(foundPatent);
    }
  }, [patentId]);

  const buildPrompt = (patent: Patent): string => {
    return `A high-quality, professional product prototype visualization based on: ${patent.title}.
${patent.abstract}
The design should be modern, sleek, and commercial-ready. Show the product in a clean, well-lit studio environment with professional lighting.
Product photography style, high detail, 8K resolution, photorealistic rendering.`;
  };

  const generatePrototype = async () => {
    if (!patent) return;

    try {
      setError('');

      // Step 1: Preparing
      setStatus(GenerationStatus.PREPARING);
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const prompt = buildPrompt(patent);
      setProgress(25);

      // Step 2: Generating
      setStatus(GenerationStatus.GENERATING);
      setProgress(35);

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          guidance_scale: 3.5,
          num_inference_steps: 40,
          image_size: 'landscape_16_9',
        }),
      });

      setProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate prototype');
      }

      // Step 3: Uploading
      setStatus(GenerationStatus.UPLOADING);
      setProgress(85);

      const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress(100);
      setImageUrl(data.url);
      setStatus(GenerationStatus.COMPLETE);

    } catch (err) {
      console.error('Generation error:', err);
      setStatus(GenerationStatus.ERROR);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.status === status);
  };

  const isStepComplete = (stepStatus: GenerationStatus) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = steps.findIndex(s => s.status === stepStatus);
    return currentIndex > stepIndex || status === GenerationStatus.COMPLETE;
  };

  const isStepActive = (stepStatus: GenerationStatus) => {
    return status === stepStatus;
  };

  if (!patent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Patent Not Found</h2>
          <p className="text-slate-600 mb-6">The patent you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in">
        <button
          onClick={() => router.back()}
          className="group w-10 h-10 flex items-center justify-center rounded-full bg-white/50 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all active:scale-90 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
        </button>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">
            Prototype Generation
          </h2>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight">
            {patent.title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column - Patent Info */}
        <div className="space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Patent Details</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Abstract
                </label>
                <p className="text-sm text-slate-700 leading-relaxed">{patent.abstract}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Quick Links
                </label>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={patent.page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg hover:bg-emerald-200 transition-colors border border-emerald-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Google Patents
                  </a>
                  <a
                    href={patent.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Online PDF
                  </a>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Patent Document
                </label>
                <button
                  onClick={() => setShowPdf(!showPdf)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  {showPdf ? 'Hide' : 'View'} PDF Preview
                </button>
              </div>

              {patent.tags && patent.tags.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {patent.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-slate-600 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Patent Images */}
          {patent.images && patent.images.length > 0 && (
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Patent Figures ({patent.images.length})
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {patent.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200 hover:border-blue-400 group/img cursor-pointer transition-all"
                  >
                    <Image
                      src={img.local_path}
                      alt={`${patent.title} - Figure ${idx + 1}`}
                      fill
                      className="object-contain group-hover/img:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column - Generation Area */}
        <div className="space-y-4">
          {status === GenerationStatus.IDLE && (
            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Prototype</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Generate a high-quality visual prototype of this patent using advanced AI technology.
              </p>
              <button
                onClick={generatePrototype}
                className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                <Zap className="w-5 h-5" />
                <span>Generate Prototype</span>
              </button>
            </GlassCard>
          )}

          {(status !== GenerationStatus.IDLE && status !== GenerationStatus.COMPLETE && status !== GenerationStatus.ERROR) && (
            <GlassCard className="p-5">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">Generating...</h3>
                  <span className="text-xl font-bold text-emerald-600">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                {steps.map((step, index) => (
                  <div
                    key={step.status}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                      isStepActive(step.status)
                        ? 'bg-emerald-50 border-2 border-emerald-200'
                        : isStepComplete(step.status)
                        ? 'bg-slate-50 border border-slate-200'
                        : 'bg-white border border-slate-200 opacity-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {isStepComplete(step.status) ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isStepActive(step.status) ? (
                        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">{step.label}</h4>
                      <p className="text-xs text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {status === GenerationStatus.COMPLETE && imageUrl && (
            <GlassCard className="p-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Prototype Complete</h3>
              </div>

              <div className="rounded-lg overflow-hidden border-2 border-slate-200 shadow-lg mb-4">
                <img
                  src={imageUrl}
                  alt={`Prototype of ${patent.title}`}
                  className="w-full h-auto"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={generatePrototype}
                  className="flex-1 py-2.5 px-4 text-sm bg-slate-100 text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-all"
                >
                  Regenerate
                </button>
                <a
                  href={imageUrl}
                  download
                  className="flex-1 py-2.5 px-4 text-sm bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all text-center"
                >
                  Download
                </a>
              </div>
            </GlassCard>
          )}

          {status === GenerationStatus.ERROR && (
            <GlassCard className="p-5 bg-red-50 border-2 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-red-900 mb-2">Generation Failed</h3>
                  <p className="text-sm text-red-700 mb-4">{error}</p>
                  <button
                    onClick={generatePrototype}
                    className="px-5 py-2.5 text-sm bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {/* PDF Viewer */}
          {showPdf && (
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">PDF Preview</h3>
                <div className="flex items-center gap-2">
                  <a
                    href={patent.pdf_local_path}
                    download
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                  </a>
                  <button
                    onClick={() => setShowPdf(false)}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              <div className="border-2 border-slate-200 rounded-lg overflow-hidden bg-slate-50 max-h-[600px] overflow-y-auto">
                <Document
                  file={patent.pdf_local_path}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  className="flex flex-col items-center gap-2 p-2"
                >
                  {numPages && Array.from(new Array(Math.min(numPages, 5)), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={400}
                      className="shadow-sm"
                    />
                  ))}
                </Document>
                {numPages && numPages > 5 && (
                  <div className="text-center py-3 text-sm text-slate-600 bg-slate-100">
                    Showing first 5 of {numPages} pages
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage !== null && patent.images && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="bg-white rounded-xl p-4 shadow-2xl">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={patent.images[selectedImage].local_path}
                  alt={`${patent.title} - Figure ${selectedImage + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-700">
                  Figure {selectedImage + 1} of {patent.images.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    disabled={selectedImage === 0}
                    className="px-4 py-2 text-sm bg-slate-100 text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setSelectedImage(Math.min(patent.images!.length - 1, selectedImage + 1))}
                    disabled={selectedImage === patent.images.length - 1}
                    className="px-4 py-2 text-sm bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
