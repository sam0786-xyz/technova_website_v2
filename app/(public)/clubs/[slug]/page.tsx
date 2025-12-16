import { notFound } from "next/navigation"
import { Users, User, Shield, Target, Calendar, ArrowRight, Github, Globe, Linkedin, Mail, ImageIcon } from "lucide-react"
import { getPastEvents } from "@/lib/actions/club-events"
import Link from "next/link"

const CLUBS_DATA: Record<string, any> = {
    "cyber-pirates": {
        name: "CyberPirates Club",
        tagline: "Security through obscurity is not security.",
        description: "The CyberPirates club is set with a goal to guide individuals about Information security and cyber awareness which help them gain the necessary knowledge to arm themselves against modern-day computer exploits.",
        whyJoin: "We at CyberPirates, a crucial part of Technova, are committed to building a safer society through cybersecurity education. Our objective is to empower individuals by providing them with comprehensive knowledge and skills in cybersecurity, encompassing ethical hacking, penetration testing, and various related domains. We strive to establish a vibrant community that fosters learning, collaboration, and innovation in the ever-evolving field of cybersecurity.",
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        team: [
            { name: "Sneha Mishra", role: "Club Lead" },
            { name: "Ishika Dhiman", role: "Club Co-Lead" },
            { name: "Aditya Kumar Singh", role: "Designer" },
            { name: "Anusha Bhardwaj", role: "Documentation" },
            { name: "Miriam Victoria", role: "Technical" },
            { name: "Ritesh Sharma", role: "Technical" },
            { name: "Aditya Dhanraj", role: "PR" }
        ]
    },
    "ai-robotics": {
        name: "AI & Robotics Club",
        tagline: "Innovating the future with Intelligence.",
        description: "The AI & Robotics Club is dedicated to exploring the cutting-edge worlds of Artificial Intelligence and Robotics. We aim to foster a community of innovators who are passionate about building intelligent systems and autonomous machines.",
        whyJoin: "Join us to dive deep into machine learning, deep learning, computer vision, and robotics. We organize hands-on workshops, hackathons, and projects that allow students to apply theoretical knowledge to real-world problems. Whether you are a beginner or an expert, this club provides the perfect platform to collaborate, learn, and build the future.",
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        team: [
            { name: "Muskan", role: "Lead" },
            { name: "Sapna", role: "Co-lead" },
            { name: "Kusuma", role: "Coordinator" },
            { name: "Pratham", role: "Coordinator" },
            { name: "Manya Singh", role: "Coordinator" },
            { name: "Preeti Pal", role: "Coordinator" },
            { name: "Saurav Suman", role: "Coordinator" }
        ]
    },
    "aws-cloud": {
        name: "AWS Cloud Club",
        tagline: "Building on the Cloud, for the World.",
        description: "The AWS Cloud Club focuses on cloud computing technologies and services provided by Amazon Web Services. We help students master the cloud infrastructure that powers the modern internet.",
        whyJoin: "By joining the AWS Cloud Club, you will gain hands-on experience with cloud services, serverless computing, and scalable architecture. We provide resources, workshops, and certification guidance to help you become a certified cloud practitioner and architect. Connect with industry experts and like-minded peers to accelerate your cloud journey.",
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        team: [
            { name: "Utkarsh Gaur", role: "Club Captain" },
            { name: "Shweta", role: "Marketing & Outreach Executive" },
            { name: "Vashu Kaushik", role: "Events Executive" },
            { name: "Vidit Gupta", role: "Sponsorship Executive" },
            { name: "Ayush Harsh", role: "Technical Executive" },
            { name: "Aditya Maheshwari", role: "Logistics Executive" },
            { name: "Deepak", role: "Technical Executive" }
        ]
    },
    "datapool": {
        name: "Datapool Club",
        tagline: "Data is the most important part of our life.",
        description: "Focusing on data insights, we present to you The Datapool Club of Technova. To empower students and enthusiasts in the realms of Data Science, AI, ML, and related fields.",
        whyJoin: "To empower students and enthusiasts in the realms of Data Science, AI, ML, and related fields, by curating an environment of learning and exploration. Through organizing workshops, peer-to-peer sessions, and talks by industrial experts, our goal is to bridge the knowledge gap between academia and the industry. By consistently aligning with our vision of being a global beacon of excellence in technical knowledge and our mission of fostering analytical learning, we aim to not only enhance the core competencies of our members but also provide tangible opportunities, like internships.",
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        team: [
            { name: "Rajeev Kumar", role: "Club Lead" },
            { name: "Tanisha", role: "Club Co-Lead" },
            { name: "Dushyant Prajapati", role: "Designer" },
            { name: "Siya Rathi", role: "Documentation" },
            { name: "Rahul Gupta", role: "Technical" },
            { name: "Al Dua Khan", role: "PR" }
        ]
    },
    "game-drifters": {
        name: "Game Drifters Club",
        tagline: "Cultivating a vibrant gaming community.",
        description: "Our objective is to unite passionate gamers, elevate esports excellence, and nurture aspiring game developers. Through thrilling tournaments, immersive gaming experiences, and collaborative game development projects.",
        whyJoin: "Students can learn technical skills of Game Development or get a platform to showcase their gaming talent. Game Drifters Club is a hub for gaming enthusiasts and game developers to learn and share their skills and thoughts. Don't let your gaming hobby stay a hobby, instead make it into your strength. This club is designed to be an inclusive and welcoming community that is open to gamers of all skill levels and backgrounds.",
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        team: [
            { name: "Adhyyan Sharma", role: "Club Lead" },
            { name: "Aarav Kashyap", role: "Club Co-Lead" },
            { name: "Harshit Singh", role: "Coordinator" },
            { name: "Siddhartha Singh", role: "Coordinator" },
            { name: "Tanushi Jain", role: "Coordinator" },
            { name: "Sukaina Shakeel Ansari", role: "Coordinator" },
            { name: "Anupam Vasudeva", role: "Coordinator" }
        ]
    },
    "github": {
        name: "GitHub Club",
        tagline: "A community of developers, for developers.",
        description: "This club promotes and influences young minds to learn new technologies and spark a interest in coding. This club focuses on developing technical skills, soft skills and also contributing towards open-source.",
        whyJoin: "We, at GitHub Club, aim to impart skills and knowledge to all those who are curious and have a will to learn. We tackle topics from a wide range, including programming, development, design, and a lot more. Our aim is to create a self thriving network of students which encourages the culture of open source contribution, and promotes a sense of community within students. We promote an environment that encourages leadership, technical, and research skills.",
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        team: [
            { name: "Suryansh Rai", role: "Club Lead" },
            { name: "Arnima Chakravarty", role: "Club Co-Lead" },
            { name: "Shubham Shukla", role: "Designer" },
            { name: "Deepanshu Singh", role: "Documentation" },
            { name: "Parikshit Singh", role: "Technical" },
            { name: "Tanisha Mittal", role: "PR" }
        ]
    },
    "gdg": {
        name: "GDG on Campus",
        tagline: "The beginning is always today.",
        description: "Let new adventures begin at the Google Developer Group on Campus (Technova). A very warm-hearted welcome to the community where innovation meets execution.",
        whyJoin: "Our club is more than willing to welcome anybody irrespective of their institute/university of study. We are glad to inform all of you that, this year will be the year of innovations, new creative ideas, and empowering local communities. This year, the team is not just extraordinarily talented but also artistic and skillful. The major idea this time is to create originative projects for the betterment of the local community. The club will organize resourceful workshops and webinars for enlightening the masses.",
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        team: [
            { name: "Sanskriti Verma", role: "Club Lead" },
            { name: "Abhishek Pandey", role: "AIML & Robotics Lead" },
            { name: "Masood Aslam", role: "Cyber Security Lead" },
            { name: "Priyanshu Verma", role: "Web dev & DSA Lead" },
            { name: "Yash Kumar Choudhary", role: "XR Lead" },
            { name: "Utkarsh Gaur", role: "Cloud & Open Source Lead" },
            { name: "Saksham Sharma", role: "Social Media Lead" },
            { name: "Vansh Chauhan", role: "Design Lead" },
            { name: "Narmada", role: "PR & Marketing Lead" },
            { name: "Aditya Singh", role: "Sponsorship & Outreach" },
            { name: "Harshit Singh", role: "Content Lead" }
        ]
    },
    "pixelance": {
        name: "Pixelance Club",
        tagline: "Capturing moments, creating memories.",
        description: "The Pixelance Club is a community of photography/videography enthusiasts who come together to share their passion for photography, videography learn new techniques, and explore new subjects.",
        whyJoin: "To foster photography enthusiasts, facilitate skill development, and create a supportive community for individuals with a passion for capturing moments and provide a platform to help them improve and refine their skills. By organising workshops, seminars, photo walks and competitions, we aim to help students connect with photography professionals by inviting professionals to share their knowledge. We aim to build a community of like-minded students with a shared interest in photography.",
        joinLink: "https://forms.gle/KbXuf6MCQJ2idz697",
        team: [
            { name: "Krishna Narula", role: "Club Lead" },
            { name: "Abhijit Dutta", role: "Co-Lead (Photo)" },
            { name: "Madwesha R", role: "Co-Lead (Video)" },
            { name: "Swastik Garg", role: "Coordinator" },
            { name: "Rishiyendra Kumar", role: "Coordinator" },
            { name: "Shivansh Tiwari", role: "Coordinator" },
            { name: "Keshav Grover", role: "Coordinator" },
            { name: "Sarthak Choudhary", role: "Coordinator" },
            { name: "Navya Tyagi", role: "Coordinator" },
            { name: "Christopher Yumnam", role: "Coordinator" },
            { name: "Shakhawat Ansari", role: "Coordinator" },
            { name: "Kavay Dahiya", role: "Coordinator" }
        ]
    }
}

// Hardcoded Legacy Events (History) - Verified from Technical Society
const LEGACY_EVENTS: Record<string, any[]> = {
    "cyber-pirates": [
        {
            id: "legacy-1",
            title: "Hack-a-Phone",
            description: "A remarkable gathering showcasing live demonstrations of phone hacking techniques. Conducted by Club Co-Lead Mr. Pranaav Bhatnagar and Ms. Chetna Talan, providing valuable insights on maintaining personal safety in the digital realm.",
            start_time: "2023-06-12T10:00:00Z",
            end_time: "2023-06-12T16:00:00Z",
            venue: "Auditorium",
            gallery: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2670", "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2670"],
            banner: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=2669",
            isLegacy: true
        },
        {
            id: "legacy-2",
            title: "Cyber Security Workshop",
            description: "A successful hands-on workshop for Computer Science students. Instructors Abhishek Kumar Singh and Abhishek Gupta introduced Linux training with surging enthusiasm.",
            start_time: "2022-07-09T10:00:00Z",
            end_time: "2022-07-09T16:00:00Z",
            venue: "School of Engineering",
            gallery: [],
            banner: null,
            isLegacy: true
        },
        {
            id: "legacy-3",
            title: "Linux Training",
            description: "An introductory session on Linux commands and file systems for beginners.",
            start_time: "2022-04-11T10:00:00Z",
            end_time: "2022-04-12T16:00:00Z",
            venue: "Online",
            gallery: [],
            banner: null,
            isLegacy: true
        }
    ],
    "ai-robotics": [
        {
            id: "legacy-ai-1",
            title: "Star Grazing",
            description: "Showcasing student-built autonomous rovers and drones. A day filled with innovation and mechanical engineering marvels.",
            start_time: "2023-09-15T10:00:00Z",
            end_time: "2023-09-15T16:00:00Z",
            venue: "Main Ground",
            gallery: [],
            banner: null,
            isLegacy: true
        }
    ],
    "aws-cloud": [
        {
            id: "legacy-aws-1",
            title: "AWS Cloud Day",
            description: "Deep dive into Serverless architectures and EC2 instance management. Guest speakers from AWS Community Builders.",
            start_time: "2023-08-20T10:00:00Z",
            end_time: "2023-08-20T16:00:00Z",
            venue: "Seminar Hall 1",
            gallery: [],
            banner: null,
            isLegacy: true
        }
    ],
    "datapool": [
        {
            id: "legacy-data-1",
            title: "Big Data Summit",
            description: "Analyzing real-world datasets using Python and R. Insights into Data Engineering career paths.",
            start_time: "2023-10-05T10:00:00Z",
            end_time: "2023-10-05T16:00:00Z",
            venue: "Lab 3",
            gallery: [],
            banner: null,
            isLegacy: true
        }
    ],
    "game-drifters": [
        {
            id: "legacy-game-1",
            title: "Technova E-Sports Cup",
            description: "Inter-college Valorant and BGMI tournament. Over 50 teams participated for the grand prize.",
            start_time: "2023-11-10T10:00:00Z",
            end_time: "2023-11-12T16:00:00Z",
            venue: "Gaming Room",
            gallery: [],
            banner: null,
            isLegacy: true
        }
    ],
    "github": [
        {
            id: "legacy-git-1",
            title: "Open Source October",
            description: "Introduction to Git, GitHub, and creating your first Pull Request. Celebrating Hacktoberfest.",
            start_time: "2023-10-01T10:00:00Z",
            end_time: "2023-10-01T16:00:00Z",
            venue: "Computer Lab 1",
            gallery: [],
            banner: null,
            isLegacy: true
        }
    ],
    "gdg": [
        {
            id: "legacy-gdg-1",
            title: "Google I/O Extended",
            description: "Watch party and technical discussions on the latest announcements from Google I/O 2023.",
            start_time: "2023-05-25T18:00:00Z",
            end_time: "2023-05-25T21:00:00Z",
            venue: "Auditorium",
            gallery: [],
            banner: null,
            isLegacy: true
        }
    ],
    "pixelance": [
        {
            id: "legacy-pix-1",
            title: "Photo Walk: Old Delhi",
            description: "Capturing the heritage and streets of Old Delhi. Workshop on street photography basics.",
            start_time: "2023-12-05T07:00:00Z",
            end_time: "2023-12-05T14:00:00Z",
            venue: "Old Delhi",
            gallery: [],
            banner: null,
            isLegacy: true
        }
    ]
}

export default async function ClubDetailsPage({ params }: { params: { slug: string } }) {
    const club = CLUBS_DATA[params.slug]
    const dbEvents = await getPastEvents(params.slug)
    const legacyEvents = LEGACY_EVENTS[params.slug] || []

    // Merge and Sort by Date Descending
    const pastEvents = [...dbEvents, ...legacyEvents].sort((a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    )

    if (!club) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Club Not Found</h1>
                    <p className="text-gray-400">The club you are looking for is coming soon.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
            {/* HERO */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-sm">
                        <span className="text-green-400 font-medium text-sm tracking-wider uppercase flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Official Technova Club
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
                        {club.name}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed mb-10">
                        {club.description}
                    </p>

                    <a
                        href={club.joinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105"
                    >
                        Join {club.name} <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </section>

            {/* PAST EVENTS */}
            {pastEvents.length > 0 && (
                <section className="py-20 bg-zinc-900/30 border-y border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-bold text-green-500 uppercase tracking-widest mb-3">Memories</h2>
                            <h2 className="text-3xl font-bold mb-4">Past Events Gallery</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">A collection of our verified past workshops, hackathons, and gatherings.</p>
                        </div>

                        <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
                            {/* Vertical Line */}
                            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/0 via-green-500/50 to-green-500/0 md:-ml-px"></div>

                            {pastEvents.map((event: any, idx: number) => {
                                const isEven = idx % 2 === 0
                                return (
                                    <div key={event.id} className={`relative mb-16 md:flex ${isEven ? 'md:flex-row-reverse' : ''} group`}>
                                        {/* Timeline Dot */}
                                        <div className="absolute left-0 md:left-1/2 -ml-[5px] top-6 w-[11px] h-[11px] rounded-full bg-black border-2 border-green-500 z-20 group-hover:scale-125 md:-ml-[5px] transition-transform shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>

                                        {/* Date Label (Desktop) - Opposite side */}
                                        <div className={`hidden md:block w-1/2 pt-3 ${isEven ? 'pl-12 text-left' : 'pr-12 text-right'}`}>
                                            <span className="text-green-400 font-mono text-xl font-bold tracking-wider">
                                                {new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Content Card */}
                                        <div className={`md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                                            {/* Mobile Date */}
                                            <div className="md:hidden text-green-400 font-mono font-bold mb-2 tracking-wider">
                                                {new Date(event.start_time).toLocaleDateString()}
                                            </div>

                                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all shadow-lg">
                                                {/* Event Banner/Gallery Hero */}
                                                <div className="h-48 overflow-hidden relative">
                                                    {event.banner ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img src={event.banner} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-green-900/20 to-black flex items-center justify-center">
                                                            <Calendar className="w-12 h-12 text-green-500/50" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                                    <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white leading-tight">
                                                        {event.title}
                                                    </h3>
                                                </div>

                                                <div className="p-6">
                                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                                                        {event.description}
                                                    </p>

                                                    {/* Mini Gallery Grid */}
                                                    {event.gallery && event.gallery.length > 0 && (
                                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                                            {event.gallery.slice(0, 3).map((photo: string, gIdx: number) => (
                                                                <div key={gIdx} className="aspect-square rounded-lg overflow-hidden bg-white/5 relative group/img">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img src={photo} alt="" className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-opacity" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-green-400 transition-colors uppercase tracking-wide">
                                                        Read Full Recap <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* "The Beginning" Node */}
                            <div className="relative md:flex items-center justify-center pt-8">
                                <div className="absolute left-0 md:left-1/2 -ml-[4px] top-8 w-[9px] h-[9px] rounded-full bg-green-500/30 md:-ml-[4px]"></div>
                                <div className="pl-12 md:pl-0 text-gray-500 text-sm font-mono tracking-widest uppercase">
                                    Club Founded
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* WHAT WE DO (Existing Section Refined) */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-sm font-bold text-green-500 uppercase tracking-widest mb-3">Why Join Us?</h2>
                            <h3 className="text-3xl md:text-4xl font-bold mb-6">Our Mission & Vision</h3>
                            <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                                {club.whyJoin}
                            </p>
                        </div>
                        <div className="grid gap-6">
                            {[
                                { title: "Workshops", desc: "Hands-on learning sessions." },
                                { title: "Projects", desc: "Build real-world applications." },
                                { title: "Networking", desc: "Connect with seniors and alumni." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                                    <p className="text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TEAM */}
            <section className="py-24 bg-zinc-900 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Meet The Team</h2>
                        <p className="text-gray-400">The minds behind {club.name}.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {club.team.map((member: any) => (
                            <div key={member.name} className="group bg-black border border-white/10 p-6 rounded-2xl hover:border-green-500/50 transition-all">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:text-green-500 transition-colors">
                                    <User className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                                <p className="text-green-500 text-sm font-medium uppercase tracking-wide">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
