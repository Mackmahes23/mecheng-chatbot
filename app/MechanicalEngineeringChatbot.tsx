"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Settings, BookOpen, Wrench } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface EngineeringTopic {
  name: string;
  description: string;
  examples: string[];
}

const engineeringTopics: EngineeringTopic[] = [
  {
    name: "Thermodynamics",
    description: "Study of energy, heat, and work interactions in systems",
    examples: [
      "First Law of Thermodynamics",
      "Second Law of Thermodynamics",
      "Heat engines and refrigerators",
      "Entropy and its applications"
    ]
  },
  {
    name: "Fluid Mechanics",
    description: "Behavior of fluids (liquids and gases) at rest and in motion",
    examples: [
      "Bernoulli's Equation",
      "Reynolds Number",
      "Navier-Stokes Equations",
      "Boundary Layer Theory"
    ]
  },
  {
    name: "Solid Mechanics",
    description: "Behavior of solid materials under various forces",
    examples: [
      "Stress-Strain Relationships",
      "Beam Deflection",
      "Failure Theories",
      "Fatigue Analysis"
    ]
  },
  {
    name: "Heat Transfer",
    description: "Transfer of thermal energy between systems",
    examples: [
      "Conduction, Convection, Radiation",
      "Heat Exchanger Design",
      "Thermal Resistance",
      "Transient Heat Transfer"
    ]
  },
  {
    name: "Dynamics & Control",
    description: "Motion of objects and control of mechanical systems",
    examples: [
      "Newton's Laws of Motion",
      "Vibration Analysis",
      "Control Systems",
      "Lagrangian Mechanics"
    ]
  },
  {
    name: "Manufacturing",
    description: "Processes for creating mechanical components",
    examples: [
      "Casting and Forming",
      "Machining Processes",
      "Welding Techniques",
      "Additive Manufacturing"
    ]
  }
];

const exampleQuestions = [
  "Explain the first law of thermodynamics",
  "What is the Reynolds number?",
  "How do you calculate stress in a beam?",
  "Difference between heat and temperature",
  "What is entropy?",
  "Explain Bernoulli's equation",
  "What are the types of heat transfer?",
  "What is the factor of safety?"
];

const predefinedResponses: Record<string, string> = {
  "first law of thermodynamics":
    "The First Law of Thermodynamics states that energy cannot be created or destroyed, only converted from one form to another. Mathematically: ΔU = Q - W, where ΔU is the change in internal energy, Q is heat added to the system, and W is work done by the system. This principle is fundamental to heat engines, refrigeration cycles, and energy analysis of systems.",
  
  "reynolds number":
    "The Reynolds number (Re) is a dimensionless quantity used to predict flow patterns in fluid dynamics. It's calculated as Re = ρvL/μ, where ρ is fluid density, v is velocity, L is characteristic length, and μ is dynamic viscosity. Flow regimes: Re < 2300 (laminar), 2300 < Re < 4000 (transitional), Re > 4000 (turbulent). Applications include pipe flow analysis, aerodynamics, and hydraulic systems design.",
  
  "calculate stress in a beam":
    "Normal stress in a beam due to bending is calculated using σ = My/I, where σ is stress, M is bending moment, y is distance from neutral axis, and I is the second moment of area. For axial loading: σ = F/A, where F is force and A is cross-sectional area. Shear stress: τ = VQ/It, where V is shear force, Q is first moment of area, and t is thickness. These calculations are essential for structural analysis and mechanical design.",
  
  "difference between heat and temperature":
    "Heat is energy in transit due to temperature difference, measured in Joules (J). Temperature is a measure of average kinetic energy of particles, measured in Kelvin (K) or Celsius (°C). Heat flows from high to low temperature objects until thermal equilibrium is reached. Heat capacity (C = Q/ΔT) relates the amount of heat needed to change temperature. Specific heat (c = C/m) is heat capacity per unit mass.",
  
  "entropy":
    "Entropy (S) is a thermodynamic property that measures the degree of disorder or randomness in a system. The Second Law of Thermodynamics states that entropy of an isolated system always increases. Mathematically: ΔS = Q_rev/T for reversible processes. Applications include heat engine efficiency (Carnot cycle), refrigeration, and determining spontaneity of processes. Statistical interpretation: S = k ln(W), where W is the number of microstates.",
  
  "bernoulli's equation":
    "Bernoulli's equation states that for an incompressible, frictionless fluid, the sum of pressure energy, kinetic energy, and potential energy per unit volume is constant along a streamline: P + ½ρv² + ρgh = constant. Applications include Venturi meters, Pitot tubes, airplane wing lift, and siphon systems. Limitations: assumes steady, incompressible, inviscid flow along streamlines.",
  
  "types of heat transfer":
    "Three modes of heat transfer: 1) Conduction - energy transfer through direct contact (Fourier's Law: q = -kA(dT/dx)), 2) Convection - energy transfer between surface and moving fluid (Newton's Law: q = hA(T_s - T_∞)), 3) Radiation - energy transfer via electromagnetic waves (Stefan-Boltzmann Law: q = εσAT⁴). Real systems often involve combined modes (e.g., convective-radiative heat transfer).",
  
  "factor of safety":
    "Factor of Safety (FoS) = Ultimate Strength / Working Stress. It accounts for uncertainties in material properties, loading conditions, and analysis methods. Typical values: 1.2-1.5 for reliable materials under controlled conditions, 2-2.5 for common materials under average conditions, 3-4 for brittle materials or uncertain conditions. FoS ensures structural integrity while avoiding overdesign that increases cost and weight.",
  
  "default":
    "I'm your Mechanical Engineering assistant. I can help explain concepts across various domains including:\n\n" +
    engineeringTopics.map(topic => `• ${topic.name}: ${topic.description}`).join('\n') +
    "\n\nTry asking about specific formulas, principles, or applications in these areas!"
};

export default function MechanicalEngineeringChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your Mechanical Engineering assistant. I can help explain concepts across various domains including:\n\n" +
        engineeringTopics.map(topic => `• ${topic.name}: ${topic.description}`).join('\n') +
        "\n\nTry asking about specific formulas, principles, or applications!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "" || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate bot thinking
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let response = predefinedResponses["default"];

      // Find relevant response
      for (const [key, value] of Object.entries(predefinedResponses)) {
        if (lowerInput.includes(key) && key !== "default") {
          response = value;
          break;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleExampleClick = (question: string) => {
    setInputValue(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm your Mechanical Engineering assistant. I can help explain concepts across various domains including:\n\n" +
          engineeringTopics.map(topic => `• ${topic.name}: ${topic.description}`).join('\n') +
          "\n\nTry asking about specific formulas, principles, or applications!",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                MechEng Assistant
              </h1>
              <p className="text-sm text-slate-500">
                Mechanical Engineering Chatbot
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Chat
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Topics */}
        <div className="hidden w-64 flex-col border-r border-slate-200 bg-white/80 p-4 backdrop-blur-sm md:flex">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
            <Wrench className="h-5 w-5 text-blue-600" />
            Engineering Topics
          </h2>
          <div className="space-y-4">
            {engineeringTopics.map((topic, index) => (
              <div key={index} className="rounded-lg border border-slate-200 bg-white p-3">
                <h3 className="font-medium text-slate-800">{topic.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{topic.description}</p>
                <div className="mt-2">
                  <p className="text-xs font-medium text-slate-500">Examples:</p>
                  <ul className="mt-1 space-y-1">
                    {topic.examples.map((example, i) => (
                      <li key={i} className="text-xs text-slate-600">
                        • {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex flex-1 flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                      }`}
                    >
                      <div className="prose prose-sm prose-slate max-w-none">
                        {message.content.split("\n").map((line, i) => (
                          <p key={i} className="mb-2 last:mb-0">
                            {line}
                          </p>
                        ))}
                      </div>
                      <div
                        className={`mt-2 text-xs ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="rounded-2xl rounded-bl-none bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Example Questions */}
          <div className="border-t border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl">
              <p className="mb-2 text-sm font-medium text-slate-700">
                Try asking about:
              </p>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about mechanical engineering concepts..."
                    className="h-12 pr-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={inputValue.trim() === "" || isLoading}
                    className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              <div className="mt-2 flex items-center justify-center text-xs text-slate-500">
                <BookOpen className="mr-1 h-3 w-3" />
                <span>Mechanical Engineering Assistant v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}