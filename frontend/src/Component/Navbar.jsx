

const Navbar = ()=>{

    return (
        <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    
    <a className="p-8 text-xl font-bold" >PerSona-Talk</a>
    
  </div>
  <div className="flex-none item-center ">
       
       <span>🌜</span>
        <input type="checkbox" defaultChecked className="toggle toggle-neutral mr-5" />
      <div tabIndex={0} role="button" className="btn  btn-circle avatar" >
        <div className="w-10 rounded-full">
          <img
            alt="git hub logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Github-desktop-logo-symbol.svg/192px-Github-desktop-logo-symbol.svg.png?20200316183539"/>
        </div>
      </div>
      
    
  </div>
</div>
    )
}

export default Navbar;