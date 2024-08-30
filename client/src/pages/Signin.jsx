
export default function Signin() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">Bienvenido a StockIn</h1>
          <p className="text-muted-foreground">Inicia sesión para acceder a tu cuenta</p>
        </div>
        <button size="lg" className="w-full justify-center gap-2 p-2 bg-white text-black hover:bg-muted border-2 rounded-xl hover:bg-gray-50 hover:shadow-sm">
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  )
}