import { useEffect, useState } from "react";

interface Tablet {
    tablet_id: number;
    brand: string;
    model: string;
    os: string;
    cpu_model: string;
    cpu_cores: number;
    cpu_threads: number;
    ram_size: number;
    storage_size: number;
}


export default function TabletKartya() {

    const [tablets, setTablets] = useState<Tablet[]>([]);
    const [filterTablets, setFilterTablets] = useState<Tablet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    const [errorServer, setErrorServer] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Tablet, direction: "asc" | "desc" } | null>(null);
    const [searchTerm, setSearchTerm]=useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit]=useState<number>(25);

    const fetchTablets=(page:number)=>{
        console.log(`Fetching tablets: page=${page}, limit=${limit}`);
        setLoading(true);
        setError(null);
    
        fetch(`http://localhost:3000/tablets?page=${page}&limit=${limit}`)
            .then((response) => {
                if (response.status === 404) {
                    setErrorServer('A kért erőforrás nem található (404)!');
                }
                if (!response.ok) {
                    setErrorServer(`Server responded with status ${response.status}`);
                }
                return response.json()
            })
            .then((data) => {
                setTablets(data.data);
                setFilterTablets(data.data);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error.message)
                setError(error.message);
            })
    };

    useEffect(()=>{
        fetchTablets(currentPage);
    }, [currentPage, limit]);

    const handlePageChange=(page:number)=>{
        if(page>=1 && page<=totalPages){
            setCurrentPage(page);
        }
    }

    const sortTablets=(key: keyof Tablet, direction: "asc" | "desc")=>{
        const sortedTablets=[...filterTablets].sort((a, b)=>{
            if(a[key]<b[key]){
                return direction==="asc" ? -1 : 1;
            }
            if(a[key]>b[key]){
                return direction==="asc" ? 1 : -1;
            }
            return 0;
        });
        setFilterTablets(sortedTablets);
        setSortConfig({key, direction});
    };

    const handleSearch=(event: React.ChangeEvent<HTMLInputElement>)=>{
        const term=event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered=tablets.filter((tablet)=>
            tablet.brand.toLowerCase().includes(term) ||
            tablet.model.toLowerCase().includes(term) ||
            tablet.os.toLowerCase().includes(term) ||
            tablet.cpu_model.toLowerCase().includes(term) ||
            tablet.ram_size.toString().includes(term) ||
            tablet.storage_size.toString().includes(term)
        );
        setFilterTablets(filtered);
    }

    if (errorServer) {
        return <p>{errorServer}</p>
    }
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Hiba történt: {error}.</p>
    }

    return <>
        <header className="container my-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm p-3">
                <a className="navbar-brand" href="/">
                    <h1 className="text-primary m-0">Tabletek</h1>
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link text-secondary" href="/">Kezdőlap</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-secondary" href="/tabletFelvetel">Tablet felvétel</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-secondary" href="/tabletTorles">Tablet törlése</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle text-secondary" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Rendezés
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="#" onClick={()=>sortTablets("brand", "asc")}>Név</a></li>
                                <li><a className="dropdown-item" href="#" onClick={()=>sortTablets("os", "asc")}>Operációs rendszer</a></li>
                                <li><a className="dropdown-item" href="#" onClick={()=>sortTablets("cpu_model", "asc")}>CPU</a></li>
                                <li><a className="dropdown-item" href="#" onClick={()=>sortTablets("ram_size", "asc")}>RAM</a></li>
                                <li><a className="dropdown-item" href="#" onClick={()=>sortTablets("storage_size", "asc")}>Tárhely</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle text-secondary" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Találatok száma <span className="badge bg-primary text-wrap">{limit}</span>
                            </a>

                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="#" onClick={()=>setLimit(25)}>25</a></li>
                                <li><a className="dropdown-item" href="#" onClick={()=>setLimit(50)}>50</a></li>
                                <li><a className="dropdown-item" href="#" onClick={()=>setLimit(75)}>75</a></li>
                                <li><a className="dropdown-item" href="#" onClick={()=>setLimit(100)}>100</a></li>
                            </ul>
                        </li>
                    </ul>
                    <form className="d-flex ms-auto">
                        <label>
                            <input className="form-control me-2" type="text" value={searchTerm} onChange={handleSearch} placeholder="Keresés..."/>
                        </label>
                    </form>
                </div>
            </nav>
        </header>
        <main className="container mt-4">
            <div className="row">
                {filterTablets.map((tablet) => (
                    <div className="col-md-6 col-lg-4 mb-4" key={tablet.tablet_id}>
                        <div className="card shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold text-primary">
                                    {tablet.brand} {tablet.model}
                                </h5>
                                <p className="card-text text-muted">
                                    <strong>OS:</strong> {tablet.os}<br />
                                    <strong>CPU:</strong> {tablet.cpu_model} - {tablet.cpu_cores} mag - {tablet.cpu_threads} szál<br />
                                    <strong>RAM:</strong> {tablet.ram_size} GB<br />
                                    <strong>Tárhely:</strong> {tablet.storage_size} GB
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
        <footer className="bg-light py-3">
            <div className="container text-center">
                <div className="d-flex justify-content-center align-items-center gap-3">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-primary"
                    >
                        &#8592;
                    </button>
                    <span className="fw-bold">
                        Oldal {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-primary"
                    >
                        &#8594;
                    </button>
                </div>
            </div>
        </footer>

    </>
}