import { Button } from "@/components/ui/button";

export function PresetAmountButton({ amount, onClick, className }) {
  return (
    <Button 
      variant="outline" 
      onClick={() => onClick(amount)}
      className={`${className} text-base py-6`}
    >
      ₹{amount}
    </Button>
  );
}
