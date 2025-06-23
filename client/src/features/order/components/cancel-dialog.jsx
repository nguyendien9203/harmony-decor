import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const CancelDialog = ({
  onConfirm,
  trigger,
  description = "Bạn chắc chắn muốn huỷ đơn hàng này?",
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận huỷ đơn</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button type="button" variant="secondary">
              Đóng
            </Button>
          </DialogClose>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Đồng ý
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelDialog;
