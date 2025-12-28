import Navbar from "../components/navbar"
import Footer from "../components/footer"
const Demo=()=>{
    return(
        <>
        <Navbar/>
            <div className="pt-25 flex justify-center items-center py-10 bg-gray-50">
                <video 
                    src="demo.mp4" 
                    controls 
                    autoPlay={false} 
                    className="w-3/4 rounded-2xl shadow-lg"
                />
            </div>
        <Footer/>
        </>
    )
}
export default Demo;