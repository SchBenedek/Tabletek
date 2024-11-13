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
  

export default function Kezdolap(){
    
    const [tablets, setTablets] = useState<Tablet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    const [errorServer, setErrorServer] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:3000/tablets")
            .then((response) => { 
                if (response.status === 404){
                    setErrorServer('A kért erőforrás nem található (404)!');
                }
                if (!response.ok) {
                    setErrorServer(`Server responded with status ${response.status}`);
                }
                return response.json() 
            })
            .then((data) => {
                setTablets(data);
                setLoading(false);
            })
            .catch((error) => { 
                console.log(error.message) 
                setError(error.message);
            })
    }, [])

    const legNagyobb = tablets.length > 0 
    ? [...tablets].sort((a, b) => b.storage_size - a.storage_size).slice(0, 3) 
    : [];

    const legKisebb = tablets.length > 0 
    ? [...tablets].sort((a, b) => a.storage_size - b.storage_size).slice(0, 3) 
    : [];
    
    if(errorServer){
        return <p>{errorServer}</p>
    }
    if(loading) { 
        return <p>Loading...</p>
    }
    if(error){
        return <p>Hiba történt: {error}.</p>
    }

    return<>
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
                        <a className="nav-link text-secondary" href="/tabletKartya">Tablet kiírás</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-secondary" href="/tabletFelvetel">Tablet felvétel</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-secondary" href="/tabletTorles">Tablet törlése</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <main className="container mt-4">
        <h3>Legnagyobb tárhely</h3><br/>
        <div className="row">
            {legNagyobb.map((tablet) => (
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
        </div><br/>
        <h3>Legkisebb tárhely</h3><br/>
        <div className="row">
            {legKisebb.map((tablet) => (
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

    </>
}