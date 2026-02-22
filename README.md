# Distributed Notification Processing System

This repository contains a distributed notification processing system built with:

- **Node.js** (Express API + Kafka consumers)
- **Kafka (Redpanda)** for event streaming
- **Redis (Redlock)** for distributed locks
- **MongoDB** for persistence and idempotency
- **Docker / Docker Compose** for container orchestration

---

## 🧠 Architecture Overview

Requests enter through an **API (nginx load-balanced)** → enqueue to **Kafka** → multiple consumers handle processing with:
✔ Distributed locks  
✔ Idempotency via MongoDB  
✔ Retry & DLQ support  
✔ Concurrent scaling via Kafka partitions

A visualization of the system flow:


::contentReference[oaicite:1]{index=1}


---

## 🚀 Technologies Used

| Component | Technology |
|-----------|------------|
| API Load Balancer | NGINX |
| Message Broker | Kafka (Redpanda) |
| Distributed Locking | Redis + Redlock |
| Persistence | MongoDB |
| Containerization | Docker & Docker Compose |

---

## 📦 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Harsh72019/Distributed-Notification-Processing-System-Kafka.git
cd Distributed-Notification-Processing-System-Kafka
