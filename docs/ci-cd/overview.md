# CI/CD Overview - Miqatona

## الهدف
نظام CI/CD في هذا المشروع هدفه:
- ضمان أن أي تغيير في الكود لا يكسر الإنتاج
- نشر تلقائي وآمن على VPS
- تقليل downtime إلى أقصى حد

---

## البنية الحالية

### Environments
- staging → VPS الحالي (اختبار + تطوير)
- production → سيتم إضافته لاحقًا

---

## البنية التقنية

### Infrastructure
- Docker Compose (staging & production split)
- Nginx reverse proxy
- Next.js application
- PostgreSQL database

### Image Registry
- GitHub Container Registry (GHCR)
- Image: ghcr.io/mr-badr/ar-clock

---

## CI/CD Flow (v1 - Staging Deployment)
