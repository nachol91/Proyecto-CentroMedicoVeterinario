const url = import.meta.env.VITE_API_URL;

export const authLogin = async (datos) =>{
    try {
        const resp = await fetch(`${url}/auth/login`, {
            method: "POST",
            body: JSON.stringify(datos),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await resp.json();

        return data;
        
    } catch (error) {
        console.log(error);
        return {msg: "no se pudo conectar con el backend"}
        
    }
}