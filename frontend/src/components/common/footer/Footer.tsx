import './Footer.css';

export default function Footer() {
    return (
        <footer className="Footer">
            <span>© Holidex</span>
            <span className="Footer__divider">|</span>
            <span>Server: {import.meta.env.VITE_REST_SERVER_URL}</span>
        </footer>
    );
}