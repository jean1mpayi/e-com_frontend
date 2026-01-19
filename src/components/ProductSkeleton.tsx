import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ProductSkeleton() {
  return (
    <Card className="h-min">
      {/* Image Skeleton */}
      <Skeleton className="h-full w-full" />
      <CardContent className="p-4 space-y-2">
        {/* Title Skeleton */}
        <Skeleton className="h-5 w-3/4" />
        {/* Category Skeleton */}
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {/* Price & Button Skeleton */}
        <Skeleton className="h-min w-full" />
      </CardFooter>
    </Card>
  );
}