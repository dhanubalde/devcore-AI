"use client"

import { useProModal } from "@/hooks/use-Prop-Modal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";



const ProModal = () => {

  const proModal = useProModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { 
    setIsMounted(true)
  },[])


  if (!isMounted) { 
    return null
  }

  const onSubscribe = async () => { 
    try {
      setLoading(true)
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url

    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong."
      })
    } finally { 
      setLoading(false)
    }
  }

 
  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-x-4">
          <DialogTitle className="text-center">
              Upgrade to Pro
          </DialogTitle>
          <DialogDescription className=" text-center space-y-2">
            Create <span className="text-sky-500 mx-1 font-medium">Custom AI</span> Devcores!
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between">
          <p className="text-2xl font-medium">
            $15
            <span className=" text-sm font-normal">
              .99 / months
            </span>
          </p>
          <Button disabled={loading} onClick={onSubscribe} variant="premium">
              subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProModal
