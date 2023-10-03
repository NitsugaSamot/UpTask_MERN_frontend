import { useEffect } from "react"
import useProyectos from "../hooks/useProyectos"
import PreviewProyecto from "../componentes/PreviewProyecto"
import Alerta from "../componentes/Alerta"
// import  io  from "socket.io-client"

let socket

const Proyectos = () => {

  const {proyectos, alerta} = useProyectos()

  // useEffect(() => {
  //   socket = io(import.meta.env.VITE_BACKEND_URL)
  //   socket.emit('prueba', proyectos)

  //   socket.on('respuesta', (persona) => {
  //     console.log('Desde el frontend', persona)
  //   })
  // }) 
  /* El useEffect se deja sin dependencias para se que se ejecute constantemente */

  const {msg} = alerta

  // console.log(proyectos)

  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>

      {msg && <Alerta alerta={alerta} />}

      <div className="bg-white shadow mt-10 rounded-lg">
        {proyectos.length ? 
          proyectos.map(proyecto => (
            <PreviewProyecto 
              key={proyecto._id}
              proyecto={proyecto}
            />
          ))
        : <p className="text-center text-gray-600 uppercase  p-5">No hay proyectos aún</p>}
      </div>


    </>
  )
}

export default Proyectos