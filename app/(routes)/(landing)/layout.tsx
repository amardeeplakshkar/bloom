import { Navbar } from "@/components/core/Navbar";
import { BackgroundLines } from "@/components/ui/background-lines";
import { FlickeringGrid } from "@/components/ui/flickering-grid";


interface props {
    children: React.ReactNode
}

const layout = ({ children }: props) => {
    return (
        <div>
            <main className=' flex flex-col min-h-screen max-h-screen'>
                <Navbar />
                 <FlickeringGrid
                          className="z-10 absolute pointer-events-none inset-0 size-full mix-blend-screen"
                          squareSize={4}
                          gridGap={6}
                          color="#6B7280"
                          maxOpacity={0.1}
                          flickerChance={0.1}
                        />
                <div className='flex-1 flex flex-col px-4 pb-4'>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default layout