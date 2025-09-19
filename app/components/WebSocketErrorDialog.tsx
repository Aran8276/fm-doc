import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";

interface WebSocketErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WebSocketErrorDialog({
  isOpen,
  onClose,
}: WebSocketErrorDialogProps) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Koneksi WebSocket Gagal</AlertDialogTitle>
          <AlertDialogDescription>
            Terjadi kesalahan saat mencoba menyambung ke server. Silakan coba
            muat ulang halaman atau hubungi dukungan jika masalah terus
            berlanjut. PERINGATAN, PERUBAHAN TIDAK AKAN DISIMPAN JIKA KESALAHAN
            DALAM MENYAMBUNG KE SERVER WEBSOCKET.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="cursor-pointer" onClick={handleClose}>
            Mengerti
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
