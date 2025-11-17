import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UploadCTA() {
  return (
    <Card className="border-dashed border-2">
      <CardHeader>
        <CardTitle className="text-xl font-light">Загрузить новый материал</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          Поддерживаем PDF, PowerPoint и Word документы
        </p>
        <Button asChild>
          <Link href="/upload">Загрузить</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

