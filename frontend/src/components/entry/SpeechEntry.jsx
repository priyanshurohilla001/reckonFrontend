import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import { EntryForm } from "./EntryForm";

export function SpeechEntry() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  // Clean up recording resources on component unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set up timer
      setRecordingTime(0);
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
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setAudioBlob(null);
    setFormData(null);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const processAudio = async () => {
    if (!audioBlob) return;
    
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
      
      // Expected response from server:
      // {
      //   title: string,
      //   amount: number,
      //   category: string,
      //   description: string,
      //   date: string (ISO date),
      //   tags: string[]
      // }
      
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Speech Entry</CardTitle>
      </CardHeader>
      
      <CardContent>
        {formData ? (
          <EntryForm prefilledData={formData} />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-8">
            {audioBlob && !isProcessing ? (
              <div className="w-full space-y-4">
                <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={cancelRecording}>
                    Cancel
                  </Button>
                  <Button onClick={processAudio}>
                    Process Speech
                  </Button>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>Processing your speech...</p>
              </div>
            ) : (
              <>
                <div 
                  className={`
                    w-24 h-24 rounded-full flex items-center justify-center 
                    transition-all duration-200
                    ${isRecording 
                      ? 'bg-red-100 animate-pulse' 
                      : 'bg-primary/10'
                    }
                  `}
                >
                  {isRecording ? (
                    <Square className="h-10 w-10 text-red-500" />
                  ) : (
                    <Mic className="h-10 w-10 text-primary" />
                  )}
                </div>
                
                {isRecording ? (
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-mono">{formatTime(recordingTime)}</p>
                    <p className="text-sm text-red-500 animate-pulse">Recording...</p>
                    <Button 
                      variant="destructive" 
                      size="lg"
                      className="mt-4"
                      onClick={stopRecording}
                    >
                      Stop Recording
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <p>Tap to record your expense</p>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="mt-4"
                      onClick={startRecording}
                    >
                      Start Recording
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}