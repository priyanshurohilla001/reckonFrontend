import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mic, MicOff, StopCircle, AlertCircle } from "lucide-react";
import { entryService } from "@/services/api";
import { EntryForm } from "@/components/entry/EntryForm";

export function SpeechEntry() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [entryData, setEntryData] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // Cleanup function
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
        
        // Stop all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Microphone access denied. Please allow microphone access and try again.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setError(null);
    setEntryData(null);
  };
  
  const processAudio = async () => {
    if (!audioBlob) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      const data = await entryService.processSpeechEntry(audioBlob);
      setEntryData(data);
    } catch (err) {
      console.error("Error processing audio:", err);
      setError("Failed to process audio. Please try again or use manual entry.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // If we have processed entry data, show the form
  if (entryData) {
    return <EntryForm initialData={entryData} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">Speech Entry</CardTitle>
        <CardDescription className="text-center">
          Record your expense by speaking it out loud
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col items-center justify-center py-6">
          {isRecording ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping" />
              <Button
                size="lg"
                variant="destructive"
                className="h-20 w-20 rounded-full"
                onClick={stopRecording}
              >
                <StopCircle className="h-10 w-10" />
              </Button>
            </motion.div>
          ) : (
            <Button
              size="lg"
              variant={audioBlob ? "outline" : "default"}
              className="h-20 w-20 rounded-full"
              onClick={audioBlob ? resetRecording : startRecording}
            >
              {audioBlob ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
            </Button>
          )}
          
          <div className="mt-4 text-center">
            {isRecording ? (
              <div className="text-red-500 font-semibold animate-pulse">
                Recording... {formatTime(recordingTime)}
              </div>
            ) : audioBlob ? (
              <div className="text-green-600 font-semibold">Recording complete</div>
            ) : (
              <div className="text-muted-foreground">Tap to start recording</div>
            )}
          </div>
        </div>
        
        {audioUrl && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">Preview your recording:</p>
            <audio src={audioUrl} controls className="w-full" />
          </div>
        )}
        
        <div className="flex justify-center space-x-4 pt-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          
          {audioBlob && (
            <Button onClick={processAudio} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                </>
              ) : (
                "Use This Recording"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}