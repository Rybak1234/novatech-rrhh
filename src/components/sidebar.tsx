"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineMegaphone,
  HiOutlineChartBar,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserPlus,
  HiOutlineCpuChip,
  HiOutlineWrenchScrewdriver,
  HiOutlineBell,
} from "react-icons/hi2";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HiOutlineHome },
  { name: "Empleados", href: "/dashboard/empleados", icon: HiOutlineUserGroup },
  { name: "Departamentos", href: "/dashboard/departamentos", icon: HiOutlineBuildingOffice },
  { name: "Cargos", href: "/dashboard/cargos", icon: HiOutlineBriefcase },
  { name: "Asistencia", href: "/dashboard/asistencia", icon: HiOutlineClock },
  { name: "Permisos", href: "/dashboard/permisos", icon: HiOutlineCalendarDays },
  { name: "Planilla", href: "/dashboard/planilla", icon: HiOutlineBanknotes },
  { name: "Reclutamiento", href: "/dashboard/reclutamiento", icon: HiOutlineUserPlus },
  { name: "Desempeño", href: "/dashboard/desempeno", icon: HiOutlineChartBar },
  { name: "Capacitación", href: "/dashboard/capacitacion", icon: HiOutlineAcademicCap },
  { name: "Documentos", href: "/dashboard/documentos", icon: HiOutlineDocumentText },
  { name: "Contratos", href: "/dashboard/contratos", icon: HiOutlineClipboardDocumentCheck },
  { name: "Gastos", href: "/dashboard/gastos", icon: HiOutlineBanknotes },
  { name: "Activos", href: "/dashboard/activos", icon: HiOutlineCpuChip },
  { name: "Anuncios", href: "/dashboard/anuncios", icon: HiOutlineMegaphone },
  { name: "Reportes", href: "/dashboard/reportes", icon: HiOutlineChartBar },
  { name: "Configuración", href: "/dashboard/configuracion", icon: HiOutlineCog6Tooth },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white dark:bg-gray-950 px-4 pb-4">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
            <HiOutlineUserGroup className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-violet-700">NovaTech</h1>
            <p className="text-[10px] text-muted-foreground -mt-1">Recursos Humanos</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-violet-600" : "text-gray-400")} />
                    {item.name}
                  </Link>
                </li>
              );
            })}

            {/* Logout */}
            <li className="mt-auto border-t pt-4">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
