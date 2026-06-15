# ai-core

**Agentic AI (Otonom Yapay Zekâ Ajanları)** dünyasının temel yapı taşlarını
oluşturan 24 kavramın Türkçe referans kılavuzu.

Bu depo, otonom yapay zekâ ajanları geliştirirken sık karşılaşılan terimleri;
ajan mimarisi, iletişim, bilgi yönetimi, güvenlik, iş akışı ve gözlemlenebilirlik
başlıkları altında derli toplu bir şekilde sunmayı amaçlar.

## İçindekiler

Kavramlar altı tematik grupta toplanmıştır:

| Bölüm | Başlık | Kavramlar |
|-------|--------|-----------|
| 1 | [Temel Ajan ve İletişim Kavramları](docs/01-temel-ajan-ve-iletisim.md) | Agent Loop, Orchestrator, Subagent, MCP, Tool Use, A2A Protocol |
| 2 | [Bilgi Yönetimi ve Güvenlik](docs/02-bilgi-yonetimi-ve-guvenlik.md) | Memory, RAG, Grounding, Context Engineering, System Prompt, Guardrails |
| 3 | [İş Akışı ve Yürütme Denetimi](docs/03-is-akisi-ve-yurutme-denetimi.md) | Policy Layer, Sandboxing, HITL, Handoffs, Agentic Pipeline, Task State |
| 4 | [Performans ve Çoklu Sistemler](docs/04-performans-ve-coklu-sistemler.md) | Parallel Execution, Evals, Observability, Agent Identity, Multi-Agent, Agent Protocols |
| 5 | [İleri Düzey ve İlgili Kavramlar](docs/05-ileri-duzey-ve-ilgili-kavramlar.md) | ReAct, CoT, ToT, Reflexion, Multi-Agent Debate, RAG altyapısı, Function Calling, Prompt Injection, LLM-as-a-Judge ve daha fazlası |

> **Not:** 1–4. bölümler görseldeki **24 temel kavramı**; 5. bölüm ise
> literatürde sık geçen **ileri düzey ve ilgili kavramları** kapsar.

Hızlı arama için tüm terimlerin tek sayfalık özeti:
[Sözlük (Glossary)](docs/sozluk.md)

## Kavramların Tam Listesi

### Temel Ajan ve İletişim Kavramları
1. **Agent Loop (Ajan Döngüsü)**
2. **Orchestrator (Orkestratör)**
3. **Subagent (Alt Ajan)**
4. **MCP (Model Context Protocol)**
5. **Tool Use (Araç Kullanımı)**
6. **A2A Protocol (Ajanlar Arası Protokol)**

### Bilgi Yönetimi ve Güvenlik
7. **Memory (Bellek)**
8. **RAG (Retrieval-Augmented Generation)**
9. **Grounding (Temellendirme)**
10. **Context Engineering (Bağlam Mühendisliği)**
11. **System Prompt (Sistem İstemi)**
12. **Guardrails (Güvenlik Bariyerleri)**

### İş Akışı ve Yürütme Denetimi
13. **Policy Layer (Politika Katmanı)**
14. **Sandboxing (Korumalı Alan)**
15. **HITL (Human-in-the-Loop — Döngüde İnsan)**
16. **Handoffs (Devir İşlemleri)**
17. **Agentic Pipeline (Ajan Boru Hattı)**
18. **Task State (Görev Durumu)**

### Performans ve Çoklu Sistemler
19. **Parallel Execution (Paralel Yürütme)**
20. **Evals (Değerlendirmeler)**
21. **Observability (Gözlemlenebilirlik)**
22. **Agent Identity (Ajan Kimliği)**
23. **Multi-Agent (Çoklu Ajan)**
24. **Agent Protocols (Ajan Protokolleri)**

### İleri Düzey ve İlgili Kavramlar (Ek)
- **Muhakeme & Planlama:** ReAct, Chain-of-Thought, Tree of Thoughts, Reflexion, Plan-and-Execute, Self-Consistency
- **Çoklu Ajan Desenleri:** Supervisor/Manager-Worker, Multi-Agent Debate, Swarm, Routing, Evaluator-Optimizer, Blackboard
- **Bilgi & Bağlam:** Embeddings/Vector DB, Chunking, Knowledge Graph, Bellek Türleri, Context Compression
- **Araç & Yürütme:** Function Calling, Computer/Browser Use, Code Interpreter, Caching/Retry/Circuit Breaker, Budget/Loop Limits
- **Güvenlik & Hizalama:** Prompt Injection/Jailbreak, Alignment & Constitutional AI, Red Teaming, Least Privilege
- **Değerlendirme & Öğrenme:** LLM-as-a-Judge, Trajectory Evaluation, In-context Learning, Fine-tuning/RLHF/RLAIF
- **Kavramsal Çerçeve:** Workflow vs Agent, Autonomy Levels, Determinism/Temperature

## Katkı

Yeni kavram eklemek veya mevcut açıklamaları geliştirmek için ilgili bölüm
dosyasını düzenleyip bir Pull Request açabilirsiniz. Açıklamaların kısa, net ve
Türkçe olmasına özen gösterin.
