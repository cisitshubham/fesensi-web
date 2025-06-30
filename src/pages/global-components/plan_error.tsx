import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

export default function Plan_Error() {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>This feature requires a plan upgrade.</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <img src="/images/fesensi/plan.png" alt="" className="w-1/3" />
          <p>Ask your admin to upgrade your plan as this feature is not included in your plan.</p>
        </DialogBody>
        <DialogFooter>
          <DialogClose className="w-full">Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
