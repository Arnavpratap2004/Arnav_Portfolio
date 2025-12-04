import React from "react";

export function Experience() {
    return (
        <section className="py-20 w-full">
            <h2 className="text-3xl font-bold text-center mb-10 text-white">Experience & Education</h2>
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                {/* Experience */}
                <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    <div className="bg-neutral-900 rounded-3xl p-8 h-full backdrop-blur-sm">
                        <h3 className="text-2xl font-bold text-white mb-2">Research Intern</h3>
                        <p className="text-neutral-400 font-medium">Indian Institute of Technology, Patna (IITP) | Hybrid</p>
                        <p className="text-sm text-neutral-500 mb-6">June 2025 – August 2025</p>
                        <ul className="list-disc list-inside text-neutral-300 space-y-3 leading-relaxed">
                            <li>Proposed a novel framework, <span className="text-white font-semibold">Context-Aware Dynamic Rationale Generation (CAD-RAG)</span>, for hate speech detection.</li>
                            <li>Designed a dynamic knowledge base integrating evolving slur lexicons and incident reports.</li>
                            <li>Developed a multi-query retrieval mechanism for detecting emerging "zero-day" hate speech.</li>
                            <li>Built a RAG pipeline combining socio-temporal context with input text for interpretable outputs.</li>
                        </ul>
                    </div>
                </div>

                {/* Education */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500">
                        <div className="bg-neutral-900 rounded-3xl p-8 h-full backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white mb-2">B.Tech in CSE</h3>
                            <p className="text-neutral-400">Vellore Institute of Technology</p>
                            <p className="text-sm text-neutral-500 mt-2">2023 – 2027 | CGPA: 9.16 / 10</p>
                        </div>
                    </div>

                    <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-orange-500 to-yellow-500">
                        <div className="bg-neutral-900 rounded-3xl p-8 h-full backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white mb-2">12th Standard (CBSE)</h3>
                            <p className="text-neutral-400">St. Karen’s Secondary School</p>
                            <p className="text-sm text-neutral-500 mt-2">2020 – 2022 | Percentage: 86%</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
