const { Kafka } = require('kafkajs');

class KafkaSingleton {
  constructor() {
    if (!KafkaSingleton.instance) {
      const kafka = new Kafka({
        clientId: 'notification-service',
        brokers: ['kafka:9092']
      });

      this.producer = kafka.producer();
      this.consumer = kafka.consumer({
        groupId: 'notification-group'
      });

      KafkaSingleton.instance = this;
    }
    return KafkaSingleton.instance;
  }
}

module.exports = new KafkaSingleton();