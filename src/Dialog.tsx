import { useEffect, useRef, type ReactNode } from 'react'
export function Dialog({title,children,close,drawer=false}:{title:string;children:ReactNode;close:()=>void;drawer?:boolean}) {
 const ref=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null; const d=ref.current!;d.showModal();return()=>{d.close();previous?.focus()}},[])
 return <dialog ref={ref} className={drawer?'drawer':''} aria-labelledby="dialog-title" onCancel={e=>{e.preventDefault();close()}}><div className="dialog-top"><h2 id="dialog-title">{title}</h2><button aria-label="Close dialog" onClick={close}>×</button></div>{children}</dialog>
}
