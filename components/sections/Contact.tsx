import React from "react";
import { BackgroundBeams } from "@/components/ui/BackgroundBeams";

export function Contact() {
    return (
        <section className="py-32 w-full relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-16 text-white tracking-tight">Get in Touch</h2>
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <h3 className="text-2xl font-semibold text-white">Let's collaborate</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                        </p>
                        <div className="space-y-4">
                            <a href="mailto:arnavpratap2003@gmail.com" className="flex items-center space-x-3 text-neutral-300 hover:text-white transition-colors">
                                <span>arnavpratap2003@gmail.com</span>
                            </a>
                            <div className="flex gap-6 pt-4">
                                <a href="https://www.linkedin.com/in/arnavpratap2004/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                                    LinkedIn
                                </a>
                                <a href="https://github.com/Arnavpratap2004" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        <div className="bg-neutral-900 rounded-3xl p-8 h-full backdrop-blur-sm">
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full rounded-xl border-neutral-800 bg-black/50 text-white focus:border-blue-500 focus:ring-blue-500 p-4 transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full rounded-xl border-neutral-800 bg-black/50 text-white focus:border-blue-500 focus:ring-blue-500 p-4 transition-all"
                                        placeholder="Your message..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <BackgroundBeams />
        </section>
    );
}
