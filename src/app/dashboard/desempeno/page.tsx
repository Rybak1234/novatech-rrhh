import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";
import { HiOutlineChartBar, HiOutlinePlus, HiOutlineStar, HiOutlineFlag, HiOutlineTrophy } from "react-icons/hi2";

export default async function DesempenoPage() {
  const [reviews, goals] = await Promise.all([
    prisma.performanceReview.findMany({
      include: { employee: { include: { department: true } }, reviewer: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.performanceGoal.findMany({
      include: { employee: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "—";
  const completedGoals = goals.filter((g) => g.status === "COMPLETADO").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineChartBar className="h-7 w-7 text-violet-600" /> Evaluación de Desempeño</h1>
          <p className="text-muted-foreground">Evaluaciones, metas y KPIs del personal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><HiOutlineFlag className="h-4 w-4 mr-2" /> Nueva Meta</Button>
          <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nueva Evaluación</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-violet-600">{reviews.length}</p><p className="text-xs text-muted-foreground">Evaluaciones</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1"><HiOutlineStar className="h-5 w-5" /> {avgRating}</p><p className="text-xs text-muted-foreground">Promedio</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{goals.length}</p><p className="text-xs text-muted-foreground">Metas Activas</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{completedGoals}</p><p className="text-xs text-muted-foreground">Metas Cumplidas</p></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reviews */}
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><HiOutlineTrophy className="h-5 w-5 text-violet-600" /> Últimas Evaluaciones</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border-b pb-3 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{getInitials(`${r.employee.firstName} ${r.employee.lastName}`)}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-medium text-sm">{r.employee.firstName} {r.employee.lastName}</p>
                      <p className="text-[11px] text-muted-foreground">{r.employee.department?.name} — {r.period}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (<HiOutlineStar key={i} className={`h-4 w-4 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />))}</div>
                </div>
                {r.strengths && <p className="text-xs text-green-600 mt-1">✓ {r.strengths}</p>}
                {r.improvements && <p className="text-xs text-orange-600">⚠ {r.improvements}</p>}
                <p className="text-[11px] text-muted-foreground mt-1">Evaluador: {r.reviewer.firstName} {r.reviewer.lastName}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-center text-muted-foreground py-8">No hay evaluaciones</p>}
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><HiOutlineFlag className="h-5 w-5 text-violet-600" /> Metas y Objetivos (KPIs)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {goals.map((g) => (
              <div key={g.id} className="border-b pb-3 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="font-medium text-sm">{g.title}</p>
                    <p className="text-[11px] text-muted-foreground">{g.employee.firstName} {g.employee.lastName}</p>
                  </div>
                  <Badge variant={g.status === "COMPLETADO" ? "success" : g.status === "CANCELADO" ? "destructive" : "warning"}>{g.status.replace("_", " ")}</Badge>
                </div>
                {g.description && <p className="text-xs text-muted-foreground mb-2">{g.description}</p>}
                <div className="flex items-center gap-2">
                  <Progress value={g.progress} className="h-2 flex-1" />
                  <span className="text-xs font-medium">{g.progress}%</span>
                </div>
                {g.targetDate && <p className="text-[11px] text-muted-foreground mt-1">Plazo: {formatDate(g.targetDate)}</p>}
              </div>
            ))}
            {goals.length === 0 && <p className="text-center text-muted-foreground py-8">No hay metas registradas</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
