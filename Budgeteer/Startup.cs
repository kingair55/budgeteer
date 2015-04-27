using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Budgeteer.Startup))]
namespace Budgeteer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}