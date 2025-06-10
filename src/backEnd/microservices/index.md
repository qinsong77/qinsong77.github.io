# Summary

- [Write your application as a modular binary. Deploy it as a set of microservices.](https://serviceweaver.dev/)

## 测试

- [Testing Strategies in a Microservice Architecture](https://martinfowler.com/articles/microservice-testing/#agenda)

The structure is organized according to the testing pyramid, from bottom to top:

- Unit Test – Tests the smallest testable piece of software in the application to verify it behaves as expected.
- Integration Test – Tests integrations with data stores and external components (Kafka integration).
- Component Test – In a microservice architecture, the components are the services themselves.
- Contract Test - Where all the consumer/provider contract lives.
