

export default function login(){
    return (
    <div>
      <form action="POST">
        <label>
          <input type="text" name="mail" id="mail" />
        </label>

        <label>
          <input type="password" name="password" id="password" />
        </label>
        
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
}