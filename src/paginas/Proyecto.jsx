import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"
import ModalFormularioTarea from "../componentes/ModalFormulario"
import ModalEliminarTarea from "../componentes/ModalEliminarTarea"
import ModalEliminarColaborador from "../componentes/ModalEliminarColaborador"
import Tarea from "../componentes/Tarea"
import Alerta from "../componentes/Alerta"
import Colaborador from "../componentes/Colaborador"
import io from 'socket.io-client'

let socket;

const Proyecto = () => {

  const params = useParams()

  const { obtenerProyecto, proyecto , cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea } = useProyectos()
  const admin = useAdmin()
//   console.log(admin)

  useEffect( () => {
    obtenerProyecto(params.id)
  }, []) 


  /* Este se ejecurta una sola vez para entrara a ese "cuarto" */
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
    socket.emit('abrir proyecto', params.id)
  }, [])

  /* Se ejecita todo el tiempo */


  useEffect(() => {
    socket.on("tarea agregada", tareaNueva => {
      if(tareaNueva.proyecto === proyecto._id){
            submitTareasProyecto(tareaNueva)
      }
    })

    socket.on("tarea eliminada", tareaEliminada => {
      if(tareaEliminada.proyecto === proyecto._id) {
          eliminarTareaProyecto(tareaEliminada)
      }
    })

    socket.on("tarea actualizada", tareaActualizada => {
      if(tareaActualizada.proyecto._id === proyecto._id) {
          actualizarTareaProyecto(tareaActualizada)
      }
    })

    socket.on("nuevo estado", nuevoEstadoTarea => {
      if(nuevoEstadoTarea.proyecto._id === proyecto._id) {
          cambiarEstadoTarea(nuevoEstadoTarea)
      }
    })
  })

  const {nombre} = proyecto

  if(cargando) return 'Cargando...' 

  const { msg } = alerta

//   console.log(proyecto)

  
  return (
    
    <>
      <div className="flex justify-between">
          <h1 className="font-black text-4xl">{nombre}</h1>


          {admin && (
                <div className="flex items-center gap-2 text-gray-400 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>

                    <Link
                        to={`/proyectos/editar/${params.id}`}
                        className='uppercase font-bold'
                    >
                            Editar
                    </Link>
                </div>
            )}
      </div>


        {admin && (
            <button
                onClick={handleModalTarea}
                type="button"
                className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center"
                >

                <svg fill="currentColor" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-6 w-6">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0V8.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L6.2 9.74a.75.75 0 101.1 1.02l1.95-2.1v4.59z"></path>
                </svg>
                    Nueva tarea
            </button>
        )}
            
            <p className="font-bold text-xl mt-10">Tareas del proyecto</p>

            <div className="bg-white shadow mt-10 rounded-lg">
                    {proyecto.tareas?.length ? 
                    proyecto.tareas?.map( tarea => (

                        <Tarea
                            key={tarea._id}
                            tarea={tarea}
                        />
                    )) : 
                    <p className="text-center my-5 p-10">No hay tareas existentes en este proyecto</p>}
            </div>

            
            <div className="flex items-center justify-between mt-10">
                 <p className="font-bold text-xl ">Colaboradores</p>

                 {admin &&(
                        <Link
                            to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                            className='text-gray-400 hover:text-black uppercase font-bold'
                        >
                            Añadir
                        </Link>
                 )}
            </div>

            <div className="bg-white shadow mt-10 rounded-lg">
                    {proyecto.colaboradores?.length ? 
                    proyecto.colaboradores?.map( colaborador => (

                        <Colaborador
                            key={colaborador._id}
                            colaborador={colaborador}
                        />
                    )) : 
                    <p className="text-center my-5 p-10">No hay colaboradores en este proyecto</p>}
            </div>                
            

            <ModalFormularioTarea/>
            <ModalEliminarTarea/>
            <ModalEliminarColaborador/>
        </>
      )   
    
}

export default Proyecto