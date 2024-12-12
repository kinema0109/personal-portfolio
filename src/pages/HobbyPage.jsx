import SEO from "../components/SEO";

const HobbyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <SEO
                title="Hobby"
                description="Welcome to my portfolio website. I'm a Full Stack Developer specializing in modern web technologies. This is my hobby to share with everyone. Hope you like it."
                path="/hobby"
            />
            <a>hello world</a>
        </>
    )
}
export default HobbyPage