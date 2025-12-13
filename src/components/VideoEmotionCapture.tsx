import { useRef, useState, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Video, StopCircle, Camera, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export interface EmotionData {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

export interface PersonaResult {
  personaType: 'Adventurer' | 'Intellectual' | 'Social Butterfly' | 'Homebody' | 'Creative' | 'Romantic';
  dominantEmotions: string[];
  traits: string[];
  communicationStyle: string;
  emotionProfile: EmotionData;
  confidence: number;
}

interface VideoEmotionCaptureProps {
  question: string;
  questionIndex: number;
  onCapture: (emotions: EmotionData) => void;
  onComplete: () => void;
}

const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

export const VideoEmotionCapture = ({ 
  question, 
  questionIndex, 
  onCapture, 
  onComplete 
}: VideoEmotionCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [currentEmotions, setCurrentEmotions] = useState<EmotionData | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        console.log('Loading face-api models...');
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        console.log('Models loaded successfully');
        setModelsLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load emotion detection models');
        setIsLoading(false);
      }
    };

    loadModels();

    return () => {
      stopRecording();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      return true;
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please allow camera permissions.');
      return false;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const detectEmotions = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const canvas = canvasRef.current;
        const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }

        const emotions: EmotionData = {
          neutral: detections.expressions.neutral || 0,
          happy: detections.expressions.happy || 0,
          sad: detections.expressions.sad || 0,
          angry: detections.expressions.angry || 0,
          fearful: detections.expressions.fearful || 0,
          disgusted: detections.expressions.disgusted || 0,
          surprised: detections.expressions.surprised || 0,
        };

        setCurrentEmotions(emotions);
        return emotions;
      }
    } catch (err) {
      console.error('Detection error:', err);
    }
    return null;
  }, [modelsLoaded]);

  const startRecording = async () => {
    const cameraStarted = await startCamera();
    if (!cameraStarted) return;

    setIsRecording(true);
    setRecordingTime(0);

    const emotionSamples: EmotionData[] = [];
    
    // Start emotion detection interval
    intervalRef.current = window.setInterval(async () => {
      const emotions = await detectEmotions();
      if (emotions) {
        emotionSamples.push(emotions);
      }
      setRecordingTime(prev => prev + 1);
    }, 500);

    // Auto-stop after 15 seconds
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Average the emotions
      if (emotionSamples.length > 0) {
        const avgEmotions: EmotionData = {
          neutral: emotionSamples.reduce((a, b) => a + b.neutral, 0) / emotionSamples.length,
          happy: emotionSamples.reduce((a, b) => a + b.happy, 0) / emotionSamples.length,
          sad: emotionSamples.reduce((a, b) => a + b.sad, 0) / emotionSamples.length,
          angry: emotionSamples.reduce((a, b) => a + b.angry, 0) / emotionSamples.length,
          fearful: emotionSamples.reduce((a, b) => a + b.fearful, 0) / emotionSamples.length,
          disgusted: emotionSamples.reduce((a, b) => a + b.disgusted, 0) / emotionSamples.length,
          surprised: emotionSamples.reduce((a, b) => a + b.surprised, 0) / emotionSamples.length,
        };
        onCapture(avgEmotions);
        toast.success('Emotion captured successfully!');
      }
      
      setIsRecording(false);
      stopCamera();
      onComplete();
    }, 15000);
  };

  const stopRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRecording(false);
    stopCamera();
  };

  const getEmotionBar = (emotion: string, value: number) => (
    <div key={emotion} className="flex items-center gap-2">
      <span className="text-xs w-16 capitalize text-muted-foreground">{emotion}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-xs w-8 text-right">{Math.round(value * 100)}%</span>
    </div>
  );

  if (error) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => setError(null)}>
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 overflow-hidden">
      <div className="space-y-4">
        {/* Question */}
        <div className="text-center mb-4">
          <span className="text-xs text-primary font-medium">Question {questionIndex + 1}</span>
          <h3 className="font-display text-lg font-semibold mt-1">{question}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Answer this question while looking at the camera. Our AI will analyze your emotions.
          </p>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Loading emotion detection...</span>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover scale-x-[-1]"
                playsInline 
                muted
              />
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full scale-x-[-1]"
              />
              
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-sm">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Recording... {15 - Math.floor(recordingTime / 2)}s
                </div>
              )}
            </>
          )}
        </div>

        {/* Live Emotion Display */}
        {currentEmotions && isRecording && (
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">Live Emotion Detection</p>
            {Object.entries(currentEmotions).map(([emotion, value]) => 
              getEmotionBar(emotion, value)
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {!isRecording ? (
            <Button 
              onClick={startRecording} 
              disabled={isLoading || !modelsLoaded}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              Start Recording (15s)
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              onClick={stopRecording}
              className="gap-2"
            >
              <StopCircle className="w-4 h-4" />
              Stop Recording
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Generate persona from emotion samples across all questions
export const generatePersonaFromEmotions = (emotionSamples: EmotionData[]): PersonaResult => {
  // Average all samples
  const avgEmotions: EmotionData = {
    neutral: emotionSamples.reduce((a, b) => a + b.neutral, 0) / emotionSamples.length,
    happy: emotionSamples.reduce((a, b) => a + b.happy, 0) / emotionSamples.length,
    sad: emotionSamples.reduce((a, b) => a + b.sad, 0) / emotionSamples.length,
    angry: emotionSamples.reduce((a, b) => a + b.angry, 0) / emotionSamples.length,
    fearful: emotionSamples.reduce((a, b) => a + b.fearful, 0) / emotionSamples.length,
    disgusted: emotionSamples.reduce((a, b) => a + b.disgusted, 0) / emotionSamples.length,
    surprised: emotionSamples.reduce((a, b) => a + b.surprised, 0) / emotionSamples.length,
  };

  // Determine dominant emotions
  const sortedEmotions = Object.entries(avgEmotions)
    .sort(([, a], [, b]) => b - a);
  
  const dominantEmotions = sortedEmotions
    .slice(0, 3)
    .filter(([, value]) => value > 0.1)
    .map(([emotion]) => emotion);

  // Determine persona based on emotion profile
  let personaType: PersonaResult['personaType'];
  let traits: string[];
  let communicationStyle: string;

  const happyScore = avgEmotions.happy;
  const surprisedScore = avgEmotions.surprised;
  const neutralScore = avgEmotions.neutral;
  const sadScore = avgEmotions.sad;

  if (happyScore > 0.4 && surprisedScore > 0.2) {
    personaType = 'Adventurer';
    traits = ['Enthusiastic', 'Spontaneous', 'Open-minded', 'Energetic'];
    communicationStyle = 'Expressive and animated, loves sharing exciting stories';
  } else if (neutralScore > 0.5 && happyScore < 0.3) {
    personaType = 'Intellectual';
    traits = ['Thoughtful', 'Analytical', 'Calm', 'Curious'];
    communicationStyle = 'Measured and thoughtful, prefers deep conversations';
  } else if (happyScore > 0.5) {
    personaType = 'Social Butterfly';
    traits = ['Cheerful', 'Outgoing', 'Warm', 'Empathetic'];
    communicationStyle = 'Warm and engaging, naturally puts others at ease';
  } else if (sadScore > 0.2 || (neutralScore > 0.4 && happyScore < 0.2)) {
    personaType = 'Romantic';
    traits = ['Sensitive', 'Deep', 'Artistic', 'Intuitive'];
    communicationStyle = 'Thoughtful and emotionally aware, values authentic connection';
  } else if (surprisedScore > 0.3) {
    personaType = 'Creative';
    traits = ['Imaginative', 'Expressive', 'Playful', 'Original'];
    communicationStyle = 'Creative and unpredictable, loves exploring new ideas';
  } else {
    personaType = 'Homebody';
    traits = ['Relaxed', 'Dependable', 'Content', 'Genuine'];
    communicationStyle = 'Calm and steady, values comfort and consistency';
  }

  // Calculate confidence based on how distinct the emotions are
  const maxEmotion = Math.max(...Object.values(avgEmotions));
  const confidence = Math.min(0.95, maxEmotion + 0.3);

  return {
    personaType,
    dominantEmotions,
    traits,
    communicationStyle,
    emotionProfile: avgEmotions,
    confidence,
  };
};

export default VideoEmotionCapture;
