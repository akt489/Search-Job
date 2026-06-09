

function Header() {
    return (
        <nav>
            <style>
                .container{`
                display: flex;
                justify-content: space-between;
                align-items: center;
                `}
                .nav-links {`
                    display: flex;
                    gap: 1rem;
                `}
            </style>
            <div className="container">
                <div>icon</div>
                <div className="nav-links">
                    <a href="/">Find jobs</a>
                    <a href="/about">Find companies</a>
                    <a href="/contact">Log in</a>
                    <a href="/contact">Sign up</a>
                </div>
            </div>
        </nav>
    );
}

export default Header;