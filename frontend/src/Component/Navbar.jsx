
const Navbar = ()=>{

    return (
        <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    
    <a className="p-8 text-xl font-bold">PerSona-Talk</a>
    
  </div>
  <div className="flex-none item-center ">
       
       <span>🌜</span>
        <input type="checkbox" defaultChecked className="toggle toggle-neutral mr-5" />
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      
    
  </div>
</div>
    )
}

export default Navbar;