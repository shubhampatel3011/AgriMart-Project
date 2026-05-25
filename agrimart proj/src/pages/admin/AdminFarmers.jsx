import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Search, MapPin, Package } from "lucide-react";
import { toast } from "sonner";
import { farmerApi } from "../../api/services/farmerApi";

const initFarmers = [];

const statusConfig = {
  Approved: { icon: CheckCircle, cls: "bg-emerald-500/10 text-emerald-600", label: "Approved" },
  Pending: { icon: Clock, cls: "bg-amber-500/10 text-amber-600", label: "Pending" },
  Rejected: { icon: XCircle, cls: "bg-red-500/10 text-red-600", label: "Rejected" },
};

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState(initFarmers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // FETCH FARMER
  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await farmerApi.getFarmers();
      const farmersData = response.data.data || [];
      
      // Transform backend data to match component structure
      const transformedFarmers = farmersData.map((farmer) => ({
        id: farmer._id,
        name: farmer.farmerName,
        email: farmer.email,
        phone: farmer.contactNo,
        location: `${farmer.city}, ${farmer.state}` || "N/A",
        products: farmer.products || "Not specified",
        registered:
          new Date(farmer.createdAt).toLocaleDateString(),
        status: farmer.status || "Pending",
      }));
      
      setFarmers(transformedFarmers);
    } catch (error) {
      console.error("Error while fetching the farmers:", error);
      toast.error("Failed to fetch farmers");
    }
  };

 const filtered = farmers.filter((f) => {
  const matchSearch =
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.location.toLowerCase().includes(search.toLowerCase()) ||
    f.products.toLowerCase().includes(search.toLowerCase());
  const matchStatus = statusFilter === "All" || f.status === statusFilter;
  return matchSearch && matchStatus;
});

  const setStatus = async (id, status) => {
    try{
      await farmerApi.updateFarmers(id, {status});

      setFarmers((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
      toast.success(`Farmer ${status} successfully.`);
    }
    catch(error){
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-foreground">
          Farmers
        </h2>
        <p className="text-muted-foreground text-sm">
          {farmers.length} registered farmers
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {["Approved", "Pending", "Rejected"].map((s) => {
          const count = farmers.filter((f) => f.status === s).length;
          const { icon: Icon, cls } = statusConfig[s];
          return (
            <div
              key={s}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${cls}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-xl text-foreground">
                  {count}
                </div>
                <div className="text-xs text-muted-foreground">{s}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search by name, location or products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-1">
              No Farmers Yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Farmers will appear here once they register
            </p>
          </div>
        )}
        {filtered.map((f) => {
          const sc = statusConfig[f.status];
          return (
            <div
              key={f.id}
              className="bg-gradient-to-br from-white to-slate-50 rounded-xl border-2 border-slate-200 shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-200 p-4 space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-heading font-bold text-foreground text-sm line-clamp-1">
                    {f.name}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {f.email}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${sc.cls}`}
                >
                  <sc.icon className="w-3 h-3" />
                  {f.status}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3 h-3 flex-shrink-0 text-blue-600" />
                  <span className="line-clamp-1">{f.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Package className="w-3 h-3 flex-shrink-0 text-green-600" />
                  <span className="line-clamp-1">{f.products}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{f.phone}</div>
              <div className="border-t border-slate-200 pt-2.5 pb-1 text-xs text-muted-foreground">
                Reg: {f.registered}
              </div>
              {f.status === "Pending" && (
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => setStatus(f.id, "Approved")}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button
                    onClick={() => setStatus(f.id, "Rejected")}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              )}
              {f.status !== "Pending" && (
                <button
                  onClick={() => setStatus(f.id, "Pending")}
                  className="w-full px-2 py-1.5 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold text-xs transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};;

export default AdminFarmers;
