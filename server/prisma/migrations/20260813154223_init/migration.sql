-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plazo" (
    "id" TEXT NOT NULL,
    "fechaVencimiento" TEXT NOT NULL,
    "caratula" TEXT NOT NULL,
    "prioridad" TEXT NOT NULL,
    "asignadoInitials" TEXT NOT NULL,
    "asignadoNombre" TEXT,
    "estado" TEXT NOT NULL,
    "expedienteNro" TEXT,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plazo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CausaIngreso" (
    "id" TEXT NOT NULL,
    "fechaIngreso" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "sistema" TEXT NOT NULL,
    "caratula" TEXT NOT NULL,
    "tipoCausa" TEXT NOT NULL,
    "enteHospital" TEXT,
    "estadoCausa" TEXT NOT NULL,
    "notificacionStatus" TEXT NOT NULL,
    "expedienteNro" TEXT,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CausaIngreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TareaDiaria" (
    "id" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "caratulaPersona" TEXT NOT NULL,
    "responsableNombre" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TareaDiaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Convenio" (
    "id" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "expteCaratula" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "observaciones" TEXT NOT NULL,
    "tipoConvenio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Convenio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtencionPublico" (
    "id" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "personaNombre" TEXT NOT NULL,
    "telefonoWsp" TEXT NOT NULL,
    "motivoConsulta" TEXT NOT NULL,
    "medioContacto" TEXT NOT NULL,
    "atendidoPor" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtencionPublico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");
