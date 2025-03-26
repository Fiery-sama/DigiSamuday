import { Carousel, HR } from "flowbite-react";

function Home(){

    return (
    <div className="container">
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 shadow-2xl">
            <Carousel>
                <img src="./img/carousel-img-1.webp" alt="carousel-1" />
                <img src="./img/carousel-img-2.webp" alt="carousel-2" />
                <img src="./img/carousel-img-3.jpeg" alt="carousel-3" />
            </Carousel>
        </div>
        <div className="h-12" />
        <section className="bg-slate-950/60 shadow-2xl rounded-lg">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="mb-4 font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl py-4">
        <span className="text-red-600 text-8xl">Digi<span className="text-slate-300">Samuday</span></span>
        </h1>
        <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 lg:px-48 text-white">
        This is <span className="font-bold text-red-400">Web-based Society and Apartment Management Application</span> is a robust and user-centric platform designed to automate and optimize all aspects of residential society management. The application addresses key challenges faced by society management committees, residents, and security personnel by providing a seamless digital interface for various administrative and operational tasks.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
        <a href="/register" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
            Get started
            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </a>
    </div>
    </div>
    </section>
    <div className="h-12" />
    <div className="grid grid-cols-2 place-items-center justify-items-center">
        <div className="px-4">
        <img src="./img/suhail-khan.png" alt="Suhail Khan" className="w-full h-auto max-w-lg rounded-xl shadow-2xl border-2 border-slate-900" />
            </div>
            <div className="px-4">
                <h1>
                    <span className="font-bold text-4xl text-black leading-[2]">
                        About <span className="text-red-600 hover:underline">Developer</span>
                    </span>
                </h1>
                <HR />
                <p>
                    <span className="text-lg font-serif italic leading-[2]">
                    <span className="font-bold text-red-600">Suhail Khan</span> is a proficient Software Developer with expertise in web development, graphic design, and technical content creation. He holds a Bachelor’s in Software Development from Ramanujan College, DU, and is currently pursuing an MCA from IGNOU. Skilled in C, C++, Python, Java, and database management, he has hands-on experience with frameworks like Django, Spring Boot, and Hibernate, enabling him to develop dynamic and efficient applications.
                    </span>
                </p>
                <p>
                    <span className="text-lg font-serif italic leading-[2]">
                    In his role at Javatpoint, Suhail led a team of technical writers, curating and enhancing industry-relevant content while managing web publishing strategies. He has also developed multiple projects, including a 2048 Game, YouTube Video Downloader, and Expense Tracker, demonstrating his problem-solving abilities and passion for innovation. A proactive team player with strong communication skills, he is eager to contribute to impactful software solutions.
                    </span>
                </p>
            </div>
        </div>
        <div className="h-16" />
        <div className="grid grid-cols-2 place-items-center justify-items-center">
        <div className="px-4">
                <h1>
                    <span className="font-bold text-4xl text-black leading-[2]">
                        About <span className="text-red-600 hover:underline">Guide</span>
                    </span>
                </h1>
                <HR />
                <p>
                    <span className="text-lg font-serif italic leading-[2]">
                    <span className="font-bold text-red-600">Dr. Faiyaz Ahmad</span> is an accomplished academic and researcher, currently serving as an Assistant Professor in the Department of Computer Engineering at Jamia Millia Islamia, New Delhi. With over 17 years of teaching experience at undergraduate, graduate, and postgraduate levels, he has made significant contributions to the fields of artificial intelligence, deep learning, computer vision, and image processing. His research interests focus on applying deep learning techniques to image processing and optimization, and he has guided multiple Ph.D., M.Tech, and B.Tech students in cutting-edge research projects.</span>
                </p>
                <p>
                    <span className="text-lg font-serif italic leading-[2]">
                    Beyond academia, Dr. Ahmad has played a vital role in various administrative capacities, including serving as a warden, an examination coordinator, and a board member in multiple university committees. He has mentored winning teams in national-level competitions like the Smart India Hackathon and has delivered expert lectures in renowned institutions. With an extensive list of publications in SCOPUS and SCI-indexed journals, conference presentations, and patents, Dr. Ahmad continues to contribute to the advancement of computer science and engineering through research, mentorship, and academic leadership.
                    </span>
                </p>
            </div>
        <div className="px-4">
        <img src="./img/dr-faiyaz-ahmad.png" alt="Dr Faiyaz Ahmad" className="w-full h-auto max-w-lg rounded-xl shadow-2xl border-2 border-slate-900" />
        </div>
        </div>
        </div>
    );
}

export default Home;