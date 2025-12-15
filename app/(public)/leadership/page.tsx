'use client'

import { useState, useEffect } from "react"
import { Mail, Linkedin, Github, User, Award, TrendingUp, Users, Target, BookOpen, Star, Sparkles, Phone } from "lucide-react"
import Image from "next/image"

const MENTORS = [
    {
        name: "Prof. (Dr.) Sibaram Khara",
        role: "Vice Chancellor",
        message: "It is my immense pleasure to welcome all the first year students to the Sharda University. Vision of Sharda University is to transform students through Outcome-Based Education, driven by research, innovations, modern tools and high-end placements. Sharda University has adopted National Education Policy for the holistic development of students and society together. Sharda University is committed towards academic excellence to provide high-quality education with the help of highly qualified, experienced and focused teaching faculty members. Sharda University adopts modern ICT tools and state-of-the-art infrastructure for imparting quality classroom and laboratory exposure. I wish you all a successful and meaningful period during your education with Department of Computer Science & Engineering, School of Computing Science & Engineering, Sharda University.",
        imagePath: "/assets/leadership/vc.png"
    },
    {
        name: "Prof. (Dr.) Parma Nand",
        role: "Pro-Vice Chancellor",
        message: "The goal of school, guided by the Sharda University vision, is to provide transformational education that produces a skilled workforce of professionals including researchers and innovators of tomorrow with intellectual and technological resources. Our commitment and dedication is to focus on experiential, cooperative and project-based learning that allows our students to continue to adapt, grow and succeed in solving real-world problems. The school provides funding to innovative ideas of the students to develop products, patents and startups. The school has collaborated with IIA, IEA, Greater Noida Authority and other industries to ensure benchmarking of programs and activities. The school thrives to establish a partnership with industries, government organizations & academia, and become a collaborative community of faculties, students, staff and alumni to fulfil societal needs with professional ethics.",
        quote: "By The Students, For The Students and With The Students",
        imagePath: "/assets/leadership/pvc.png"
    },
    {
        name: "Prof. (Dr.) Geetha",
        role: "Dean, SSCE",
        message: "The Technical Society at Sharda School of Computing Science & Engineering is a vibrant platform where innovation meets opportunity. It brings together talented students, encouraging them to explore new technologies, work on real-world projects, and take the lead in initiatives that drive meaningful change. Here, learning goes far beyond the classroom. Students design, execute, and lead projects that challenge their skills and creativity while building teamwork, communication, and problem-solving abilities. Through hackathons, workshops, industrial visits, and collaborations with global industry leaders, members gain exposure to the latest trends and hands-on experience that prepares them for the future. Many have gone on to win national and international competitions, secure prestigious internships, and even launch startups. The Technical Society is a community that transforms potential into achievement and passion into lasting impact.",
        imagePath: "/assets/leadership/dean.png"
    },
    {
        name: "Prof. (Dr.) Sudeep Varshney",
        role: "HoD, Dept. of CSE",
        message: "Computer Science & Engineering is one of the most vibrant department of Sharda University with varieties of specialized programs in Artificial Intelligence & Machine Learning, Cyber Security, Internet of Things, Data Science and Business Intelligence. To have holistic development of students of distinct programs of computer science and to grow the innovative culture among the students, Students Activity Clubs are functional. These clubs are headed by the team of students and they are performing in different dimensions of technology under the guidance of specialized faculty members. Several national and international students are contributing to develop themselves and other peers to excel among the multidisciplinary aspects. The club activities strengthens placements, startups, national/international competitions and research outcomes. We are proud to have high aimed and energetic students club performing exceptionally well since last five years.",
        quote: "Best Wishes to All My Students",
        imagePath: "/assets/leadership/hod.png"
    },
    {
        name: "Dr. Rani Astya",
        role: "Faculty Coordinator",
        message: "The Technical Society's philosophy is to foster the all-round development of students. We aim to build an environment of collaborative growth that uplifts the whole community. Each club under the Society hosts events and activities year-round to uncover and nurture the hidden potential of every student. The objective of the students club is to sensitize the technological updating, by enabling the students to participate in various activities like, code-a-thon, hackathons, peer-to-peer learning, entrepreneurial activities, programming challenges, app development, certifications, industrial challenges and many other activities. The students club strengthens the presentation, verbal and communication skills, leadership qualities, confidence and utmost the technical skills among the students.",
        quote: "Nurturing Technical & Interpersonal Skills",
        imagePath: "/assets/leadership/coordinator.png"
    }
]


const TEAM = [
    {
        name: "Mohammad Sameer",
        role: "President",
        bio: "Leading the vision and strategy of Technova.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        icon: Award,
        imagePath: "/assets/team/mohammad_sameer.png",
        phone: "8603829005",
        email: "2023258878.mohammad@ug.sharda.ac.in",
        linkedin: "http://linkedin.com/in/connect-to-sam-xyz"
    },
    {
        name: "Masood Aslam",
        role: "Vice President",
        bio: "Driving operational excellence and team coordination.",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        icon: TrendingUp,
        imagePath: "/assets/team/masood_aslam.png",
        phone: "9540379738",
        email: "2023305225.masood@ug.sharda.ac.in",
        linkedin: "http://linkedin.com/in/masoodaslam1"
    },
    {
        name: "Khushi Narang",
        role: "Secretary",
        bio: "Managing administrative efficiency and documentation.",
        color: "text-green-500",
        bg: "bg-green-500/10",
        icon: Target,
        imagePath: "/assets/team/khushi_narang.png",
        phone: "8860077500",
        email: "2023343200.khushi@ug.sharda.ac.in",
        linkedin: "http://linkedin.com/in/khushi-narang-b984342aa"
    },
    {
        name: "Ankit Gautam",
        role: "PR Head",
        bio: "Managing external communications and brand image.",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        icon: Users,
        imagePath: "/assets/team/ankit_gautam.png",
        phone: "9599699065",
        email: "2023423329.ankit@ug.sharda.ac.in",
        linkedin: "http://linkedin.com/in/ankitgtm"
    },
    {
        name: "Suryansh Dixit",
        role: "PR Co-Head",
        bio: "Assisting in outreach and media relations.",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        icon: Users,
        imagePath: "/assets/team/suryansh_dixit.png",
        phone: "9511169064",
        email: "2023567067.suryansh@ug.sharda.ac.in",
        linkedin: "http://linkedin.com/in/suryansh-dixit-b0069227b"
    },
    {
        name: "Farhan Khan",
        role: "PR Editor",
        bio: "Curating content and managing editorial strategy.",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        icon: BookOpen,
        imagePath: "/assets/team/farhan_khan.png",
        phone: "9311477176",
        email: "2023540452.farhan@ug.sharda.ac.in",
        linkedin: "http://linkedin.com/in/farhan-khan-668439300"
    }
]

export default function LeadershipPage() {
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((current) => (current + 1) % MENTORS.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white">

            {/* HERO */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm">
                        <span className="text-indigo-400 font-medium text-sm tracking-wider uppercase">The Council & Mentors</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        Our Leadership
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Guided by experience, driven by innovation.
                    </p>
                </div>
            </section>

            {/* MENTORS CAROUSEL */}
            <section className="py-24 bg-zinc-900/30 border-y border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center flex items-center justify-center gap-4">
                        <BookOpen className="w-12 h-12 text-blue-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                            From The Administration
                        </span>
                    </h2>

                    <div className="max-w-7xl mx-auto">
                        {/* Increased min-height to accommodate long text on mobile */}
                        <div className="relative min-h-[1350px] md:min-h-[750px] transition-[height] duration-500">
                            {MENTORS.map((mentor, index) => (
                                <div
                                    key={mentor.name}
                                    className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${index === activeIndex
                                        ? "opacity-100 translate-x-0 scale-100 blur-0 z-20"
                                        : "opacity-0 translate-x-24 scale-90 blur-xl z-10 pointer-events-none"
                                        }`}
                                >
                                    <div className="h-full bg-zinc-900/40 backdrop-blur-3xl p-6 md:p-16 rounded-[3rem] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                        {/* Background Effects */}
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

                                        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 relative z-10 h-full">
                                            {/* Image Section - Floating Card Style */}
                                            <div className="relative shrink-0 group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 blur-2xl opacity-40 rounded-[2.5rem]" />
                                                <div className="w-64 h-64 md:w-80 md:h-80 bg-zinc-800 rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl relative z-10">
                                                    <img
                                                        src={mentor.imagePath}
                                                        alt={mentor.name}
                                                        className="w-full h-full object-cover object-top"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(mentor.name) + "&background=random"
                                                        }}
                                                    />
                                                </div>

                                                {/* Decorative Elements */}
                                                <div className="absolute -bottom-6 -right-6 bg-zinc-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl hidden md:block">
                                                    <Sparkles className="w-8 h-8 text-amber-400" />
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="text-center md:text-left flex-1 flex flex-col justify-center">
                                                <div className="mb-8">
                                                    <h3 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight leading-tight">
                                                        {mentor.name}
                                                    </h3>
                                                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-sm md:text-base uppercase tracking-widest">
                                                        <Award className="w-4 h-4" />
                                                        {mentor.role}
                                                    </div>
                                                </div>

                                                <div className="relative group/quote">
                                                    <span className="hidden md:block absolute -top-10 -left-6 text-8xl text-white/5 font-serif group-hover/quote:text-blue-500/10 transition-colors">"</span>
                                                    <div className="text-gray-200 relative z-10">
                                                        <p className="text-base md:text-xl leading-relaxed font-light mb-6">
                                                            {mentor.message}
                                                        </p>

                                                        {/* Render separate quote if available */}
                                                        {/* @ts-ignore */}
                                                        {mentor.quote && (
                                                            <div className="border-l-4 border-blue-500 pl-4 py-1 mt-6">
                                                                <p className="text-xl md:text-2xl font-bold text-blue-100 italic leading-relaxed">
                                                                    {/* @ts-ignore */}
                                                                    "{mentor.quote}"
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="hidden md:block absolute -bottom-16 -right-6 text-8xl text-white/5 font-serif rotate-180 group-hover/quote:text-blue-500/10 transition-colors">"</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-4 mt-8 md:mt-16 relative z-20">
                            {MENTORS.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 w-16 opacity-100 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        : "bg-white/20 w-3 hover:bg-white/40"
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TEAM GRID */}
            <section className="py-12 pb-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        <Star className="w-8 h-8 text-amber-500" />
                        Executive Council
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {TEAM.map((member) => (
                            <div key={member.name} className="group bg-zinc-900/50 border border-white/5 p-8 rounded-3xl hover:bg-zinc-900 hover:border-white/10 transition-all hover:-translate-y-1 overflow-hidden relative">
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className={`w-32 h-32 ${member.bg} ${member.color} rounded-2xl flex items-center justify-center text-current group-hover:scale-110 transition-transform overflow-hidden relative border border-white/5`}>
                                        {/* @ts-ignore */}
                                        {member.imagePath ? (
                                            <img
                                                // @ts-ignore
                                                src={member.imagePath}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Fallback to avatar if image fails
                                                    e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name) + "&background=random"
                                                }}
                                            />
                                        ) : (
                                            <member.icon className="w-12 h-12" />
                                        )}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            // @ts-ignore
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-blue-400 transition-colors"
                                            title="LinkedIn"
                                        >
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                        <a
                                            // @ts-ignore
                                            href={`tel:+91${member.phone}`}
                                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-green-400 transition-colors"
                                            title="Call"
                                        >
                                            <Phone className="w-5 h-5" />
                                        </a>
                                        <a
                                            // @ts-ignore
                                            href={`mailto:${member.email}`}
                                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 hover:text-red-400 transition-colors"
                                            title="Email"
                                        >
                                            <Mail className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1 relative z-10">{member.name}</h3>
                                <p className={`text-sm font-bold uppercase tracking-wider mb-4 ${member.color} relative z-10`}>
                                    {member.role}
                                </p>

                                <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
