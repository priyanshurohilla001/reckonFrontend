import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import { EntryForm } from "./EntryForm";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SpeechEntry({ onSuccess }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up recording resources on component unmount
  useEffect(() => {
    return () => {
      stopMediaTracks();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Properly stop and clean up media tracks
  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      // Reset any previous recording state
      setAudioBlob(null);
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
        }
        
        // Release microphone
        stopMediaTracks();
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set up timer
      setRecordingTime(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    // Stop recording if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    
    // Reset state
    setIsRecording(false);
    setAudioBlob(null);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    
    // Clean up media resources
    stopMediaTracks();
  };

  const processAudio = async () => {
    if (!audioBlob) {
      toast.error("No recording to process.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create form data with audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      // Send to server for processing
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/speech-to-text`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data) {
        // Format tags as comma-separated string for the form
        const tagsString = response.data.tags?.join(', ') || '';
        
        // Set the form data from the response
        setFormData({
          ...response.data,
          tags: tagsString
        });
        
        toast.success("Speech processed successfully!");
      }
      
    } catch (error) {
      console.error("Error processing speech:", error);
      const errorMessage = error.response?.data?.message || "Failed to process speech";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render waveform animation only during recording
  const renderWaveform = () => {
    if (!isRecording) return null;
    
    return (
      <div className="flex items-center justify-center gap-1 h-8 my-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-red-500 rounded-full"
            animate={{
              height: [15, Math.random() * 20 + 10, 15],
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full border border-border/30 shadow-sm">
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {formData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key="form"
            >
              <EntryForm 
                prefilledData={formData} 
                onSuccess={onSuccess}
                onCancel={() => {
                  setFormData(null);
                  setAudioBlob(null);
                }}
              />
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-col items-center justify-center py-4 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key="recorder"
            >
              {audioBlob && !isProcessing ? (
                <div className="w-full space-y-6">
                  <div className="bg-secondary/30 rounded-xl p-6 flex items-center justify-center">
                    <p className="text-lg font-medium text-foreground/80">Recording complete!</p>
                  </div>
                  <div className="flex flex-col gap-3 items-center">
                    <Button 
                      onClick={processAudio}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Process Speech
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={cancelRecording}
                      className="w-full"
                    >
                      Record Again
                    </Button>
                  </div>
                </div>
              ) : isProcessing ? (
                <div className="flex flex-col items-center gap-4 py-10">
                  <motion.div 
                    className="text-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-12 w-12" />
                  </motion.div>
                  <p className="text-lg font-medium text-foreground/80">Processing your speech...</p>
                </div>
              ) : (
                <>
                  <motion.div 
                    className={cn(
                      "relative w-28 h-28 rounded-full flex items-center justify-center shadow-sm",
                      isRecording ? "bg-red-500/10" : "bg-primary/10"
                    )}
                    animate={isRecording ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(220, 38, 38, 0.1)",
                        "0 0 0 15px rgba(220, 38, 38, 0)",
                      ],
                    } : {}}
                    transition={{ duration: 2, repeat: isRecording ? Infinity : 0 }}
                  >
                    {isRecording ? (
                      <Square className="h-10 w-10 text-red-500" />
                    ) : (
                      <Mic className="h-10 w-10 text-primary" />
                    )}
                    {isRecording && (
                      <motion.div
                        className="absolute -inset-1 rounded-full border-2 border-red-500/30"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  
                  {renderWaveform()}
                  
                  {isRecording ? (
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-mono font-bold text-foreground">{formatTime(recordingTime)}</p>
                      <p className="text-sm text-red-500 font-medium">Recording...</p>
                      <Button 
                        variant="destructive" 
                        size="lg"
                        className="mt-6 px-8"
                        onClick={stopRecording}
                      >
                        Stop Recording
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-lg text-foreground/80 font-medium">Tap to record your expense</p>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="mt-4 bg-primary/5 border-primary/20 hover:bg-primary/10 px-8"
                        onClick={startRecording}
                      >
                        <Mic className="mr-2 h-4 w-4" />
                        Start Recording
                      </Button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}