import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ModalShare({ open, onClose, onSubmit, postId }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string, postId: string) => void;
  postId: string;
}) {
  const [content, setContent] = useState("");

  const handleShare = () => {
    onSubmit(content, postId);
    setContent('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          Partager ce post
        </DialogHeader>
        <Input
          placeholder="Ajoutez un message à ce partage..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleShare}>Partager</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
