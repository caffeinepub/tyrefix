import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 18,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
          data-ocid="rating.toggle"
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= (hovered || value)
                ? "fill-brand-yellow text-brand-yellow"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
