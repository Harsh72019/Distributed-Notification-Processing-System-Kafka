# 📦 Distributed Notification Processing System

A production-style **distributed notification processing system** built using:

* **Node.js (Express)**
* **Kafka (Redpanda)**
* **Redis (Redlock for distributed locking)**
* **MongoDB (Idempotent persistence)**
* **Docker & Docker Compose**
* **Nginx (Load Balancer)**

This project demonstrates how to build a horizontally scalable, fault-tolerant, event-driven backend system.

---

# 🧠 Architecture Overview

## 🔄 System Flow

```
Client
   ↓
Nginx Load Balancer
   ↓
notification-service (instance 1)
notification-service (instance 2)
   ↓
Kafka Topic (notifications)
   ↓
Partitions (0,1,2)
   ↓
Consumer Group (shared groupId)
   ↓
Redis Distributed Lock
   ↓
MongoDB (Idempotent Save)
```

---

## 🏗 Key Concepts Implemented

✔ Kafka Producer & Consumer
✔ Consumer Groups
✔ Partition-based Horizontal Scaling
✔ Redis Distributed Locking (Redlock)
✔ Idempotent Processing with MongoDB
✔ Exponential Backoff Retry
✔ Dead Letter Queue (DLQ)
✔ Dockerized Multi-Service Architecture
✔ Nginx Load Balancing

---

# 🚀 How to Run the Project

## 1️⃣ Prerequisites

Make sure you have installed:

* Docker
* Docker Compose
* Node.js (only if running stress test locally)

---

## 2️⃣ Clone Repository

```bash
git clone https://github.com/Harsh72019/Distributed-Notification-Processing-System-Kafka.git
cd Distributed-Notification-Processing-System-Kafka
```

---

## 3️⃣ Start All Services

```bash
docker compose up --build
```

This will start:

* 🟥 Redpanda (Kafka)
* 🟢 MongoDB
* 🟡 Redis
* 🔵 notification-service (2 instances)
* ⚪ Nginx Load Balancer

---

## 4️⃣ Create Kafka Topics

After containers are running:

```bash
docker exec -it distributed_notification_service-kafka-1 rpk topic create notifications --partitions 3
docker exec -it distributed_notification_service-kafka-1 rpk topic create notifications-dlq
```

Verify:

```bash
docker exec -it distributed_notification_service-kafka-1 rpk topic describe notifications
```

Ensure:

```
PARTITIONS  3
```

---

# 📡 API Endpoint

### Send Notification

```
POST http://localhost:8080/send
```

### Body Example:

```json
{
  "userId": "123",
  "message": "Hello Distributed System",
  "type": "INFO"
}
```

Response:

```json
{
  "status": "Notification queued"
}
```

---

# 🧪 Stress Testing

A stress test script is included.

Run:

```bash
node stress-test.js
```

This will:

* Send multiple concurrent requests
* Validate load balancing
* Trigger parallel consumption across partitions
* Demonstrate distributed locking

---

# 🔍 Observing Consumers

To monitor logs:

```bash
docker compose logs -f notification1
docker compose logs -f notification2
```

You should see partitions distributed like:

```
notification1 → partitions [0,2]
notification2 → partitions [1]
```

This confirms horizontal scaling.

---

# 🧩 Why Partitions Matter

Kafka scaling rule:

```
Maximum parallel consumers in a group = number of partitions
```

If:

* 2 consumers
* 3 partitions

Both consumers will actively process messages.

---

# 🔐 Distributed Locking Strategy

Redis (Redlock) ensures:

* No duplicate processing
* Safe distributed execution
* Protection during rebalance or retries

---

# 🔁 Retry & DLQ Strategy

If processing fails:

1. Exponential backoff retry is triggered
2. If max retries exceeded → message pushed to DLQ topic

This ensures:

* No silent message loss
* Safe failure handling

---

# 📂 Project Structure

```
.
├── docker-compose.yml
├── load-balancer/
│   └── nginx.conf
├── services/
│   └── notification-service/
│       ├── src/
│       │   ├── config/
│       │   ├── kafka/
│       │   ├── services/
│       │   ├── routes/
│       │   └── server.js
│       └── Dockerfile
└── stress-test.js
```

---

# 🏗 Scaling the System

To scale to 4 instances:

Update docker-compose:

```yaml
notification3:
  build: ./services/notification-service
notification4:
  build: ./services/notification-service
```

Then increase Kafka partitions accordingly.

---

# 🧠 What This Project Demonstrates

This project reflects real-world backend system patterns used in:

* Order processing pipelines
* Notification engines
* Financial transaction systems
* High-throughput messaging services

---

# 📈 Future Improvements

* Manual offset commit handling
* Graceful shutdown logic
* Prometheus metrics
* Kubernetes deployment
* Multi-broker Kafka cluster
* Exactly-once semantics

---

