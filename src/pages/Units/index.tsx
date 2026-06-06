import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Phone,
  User,
  Calendar,
  Layers,
  Square,
  X,
  ChevronRight,
  FireExtinguisher,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { StatusTag } from '@/components/common/StatusTag';
import { mockUnits, mockFacilities } from '@/utils/mock';
import type { Unit, Facility, UnitType, UnitLevel } from '@/types';

const unitTypes: UnitType[] = ['商场', '酒店', '工厂', '学校', '医院', '住宅小区', '其他'];
const unitLevels: UnitLevel[] = ['重点', '一般', '关注'];

export default function Units() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<UnitType | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<UnitLevel | 'all'>('all');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const filteredUnits = useMemo(() => {
    return mockUnits.filter((unit) => {
      const matchKeyword =
        unit.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        unit.address.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchType = filterType === 'all' || unit.type === filterType;
      const matchLevel = filterLevel === 'all' || unit.level === filterLevel;
      return matchKeyword && matchType && matchLevel;
    });
  }, [searchKeyword, filterType, filterLevel]);

  const unitFacilities = useMemo(() => {
    if (!selectedUnit) return [];
    return mockFacilities.filter((f) => f.unitId === selectedUnit.id);
  }, [selectedUnit]);

  const stats = useMemo(() => {
    const total = mockUnits.length;
    const keyPoint = mockUnits.filter((u) => u.level === '重点').length;
    const normal = mockUnits.filter((u) => u.level === '一般').length;
    const attention = mockUnits.filter((u) => u.level === '关注').length;
    return { total, keyPoint, normal, attention };
  }, []);

  const handleUnitClick = (unit: Unit) => {
    setSelectedUnit(unit);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => setSelectedUnit(null), 300);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">单位档案</h1>
        <p className="text-slate-500">管理辖区内消防安全重点单位及一般单位信息</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">单位总数</p>
              <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">重点单位</p>
              <p className="text-3xl font-bold text-red-600">{stats.keyPoint}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">关注单位</p>
              <p className="text-3xl font-bold text-amber-600">{stats.attention}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">一般单位</p>
              <p className="text-3xl font-bold text-green-600">{stats.normal}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-4">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索单位名称或地址..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as UnitType | 'all')}
                  className="px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                >
                  <option value="all">全部类型</option>
                  {unitTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as UnitLevel | 'all')}
                className="px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              >
                <option value="all">全部等级</option>
                {unitLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  单位名称
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  单位类型
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  风险等级
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  地址
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  联系人
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  联系电话
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUnits.map((unit) => (
                <tr
                  key={unit.id}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => handleUnitClick(unit)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-medium text-slate-800">{unit.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {unit.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusTag status={unit.level} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="max-w-xs truncate">{unit.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{unit.contact}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{unit.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnitClick(unit);
                      }}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      查看详情
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUnits.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">未找到匹配的单位</p>
              <p className="text-sm text-slate-400 mt-1">请尝试调整搜索条件或筛选器</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            共 <span className="font-medium text-slate-700">{filteredUnits.length}</span> 条记录
          </p>
        </div>
      </div>

      {selectedUnit && (
        <>
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeSidebar}
          />
          <div
            className={`fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
              showSidebar ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700">
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedUnit.name}</h2>
                  <p className="text-red-100 text-sm mt-0.5">{selectedUnit.type}</p>
                </div>
                <button
                  onClick={closeSidebar}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <StatusTag status={selectedUnit.level} />
                    {selectedUnit.riskScore !== undefined && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUnit.riskScore >= 70
                            ? 'bg-red-100 text-red-700'
                            : selectedUnit.riskScore >= 50
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        风险评分: {selectedUnit.riskScore}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">单位地址</p>
                        <p className="text-sm text-slate-700">{selectedUnit.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">联系人</p>
                        <p className="text-sm text-slate-700">{selectedUnit.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">联系电话</p>
                        <p className="text-sm text-slate-700">{selectedUnit.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">成立日期</p>
                        <p className="text-sm text-slate-700">{selectedUnit.establishDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Square className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">建筑面积</p>
                        <p className="text-sm text-slate-700">{selectedUnit.area.toLocaleString()} ㎡</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Layers className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">楼层数</p>
                        <p className="text-sm text-slate-700">{selectedUnit.floorCount} 层</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <FireExtinguisher className="w-5 h-5 text-red-600" />
                      消防设施列表
                    </h3>
                    <span className="text-sm text-slate-500">
                      共 {unitFacilities.length} 项设施
                    </span>
                  </div>

                  <div className="space-y-3">
                    {unitFacilities.length > 0 ? (
                      unitFacilities.map((facility) => (
                        <FacilityCard key={facility.id} facility={facility} />
                      ))
                    ) : (
                      <div className="py-8 text-center border border-dashed border-slate-300 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                          <FireExtinguisher className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm">暂无消防设施记录</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-red-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-slate-800">{facility.name}</h4>
            <StatusTag status={facility.status} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-400">设施类型：</span>
              <span className="text-slate-600">{facility.type}</span>
            </div>
            <div>
              <span className="text-slate-400">数量：</span>
              <span className="text-slate-600">{facility.quantity} 个/套</span>
            </div>
            <div>
              <span className="text-slate-400">有效期至：</span>
              <span className="text-slate-600">{facility.expireDate}</span>
            </div>
            <div>
              <span className="text-slate-400">上次维护：</span>
              <span className="text-slate-600">{facility.lastMaintenance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
