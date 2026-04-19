// src/pages/staff/StaffPage.jsx — Modern POS System
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Plus, Minus, Trash2, ShoppingCart, CreditCard, Search,
    LogOut, X, Banknote, ChevronRight, CheckCircle2,
    Loader2, QrCode, Wallet, RefreshCw, Receipt,
    Coffee, User, Grid3X3, List, Zap,
    AlertCircle, Package, Hash
} from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";
const METHOD_CONFIG = {
    CASH: { label: "Tiền mặt", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: Banknote },
    MOMO: { label: "MoMo", color: "#ec4899", bg: "rgba(236,72,153,0.12)", icon: Wallet },
    VNPAY: { label: "VNPay", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", icon: CreditCard },
    PAYOS: { label: "PayOS", color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: QrCode },
};

/* ─── sub-components ─────────────────────────────────────────── */

function TableGrid({ tables, selected, onSelect, loading, onRefresh }) {
    return (
        <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: "#f0ede6", fontSize: 13, letterSpacing: 1, textTransform: "uppercase" }}>
                    Sơ đồ bàn
                </span>
                <button onClick={onRefresh} disabled={loading} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: loading ? "#555" : "#f59e0b", display: "flex", alignItems: "center", gap: 4,
                    fontSize: 12, fontWeight: 600, transition: "color 0.2s"
                }}>
                    <RefreshCw size={13} className={loading ? "spin" : ""} />
                    {loading ? "Đang tải..." : "Làm mới"}
                </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {tables.map((t) => {
                    const isFree = t.status === "FREE";
                    const isSelected = selected?.id === t.id;
                    return (
                        <button key={t.id} onClick={() => isFree && onSelect(t)}
                            style={{
                                border: isSelected ? "2px solid #f59e0b" : `2px solid ${isFree ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.3)"}`,
                                borderRadius: 10, padding: "10px 6px", cursor: isFree ? "pointer" : "not-allowed",
                                background: isSelected ? "rgba(245,158,11,0.18)" : isFree ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.06)",
                                transition: "all 0.18s", textAlign: "center",
                            }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: isSelected ? "#f59e0b" : isFree ? "#10b981" : "#ef4444" }}>
                                B{t.number}
                            </div>
                            <div style={{
                                marginTop: 3, width: 6, height: 6, borderRadius: "50%",
                                background: isFree ? "#10b981" : "#ef4444", margin: "3px auto 0"
                            }} />
                        </button>
                    );
                })}
            </div>
            {/* legend */}
            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
                {[["#10b981", "Trống"], ["#f59e0b", "Đã chọn"], ["#ef4444", "Bận"]].map(([c, l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#888" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />{l}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProductCard({ product, onAdd, viewMode }) {
    const outOfStock = !product.stockQuantity;
    if (viewMode === "list") {
        return (
            <button onClick={() => !outOfStock && onAdd(product)} disabled={outOfStock} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: outOfStock ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12,
                padding: "10px 14px", cursor: outOfStock ? "not-allowed" : "pointer",
                opacity: outOfStock ? 0.5 : 1, transition: "all 0.16s", width: "100%", textAlign: "left",
            }}
                onMouseOver={e => !outOfStock && (e.currentTarget.style.background = "rgba(245,158,11,0.1)")}
                onMouseOut={e => e.currentTarget.style.background = outOfStock ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)"}
            >
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#1a1a1a" }}>
                    <img src={product.imageUrl || `https://placehold.co/80/1a1a1a/555?text=☕`} alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.src = "https://placehold.co/80/1a1a1a/555?text=☕"; }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#f0ede6", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {product.name}
                    </div>
                    <div style={{ color: "#888", fontSize: 11, marginTop: 1 }}>{product.category?.name}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13 }}>{fmt(product.price)}</div>
                    <div style={{ fontSize: 10, color: outOfStock ? "#ef4444" : "#555", marginTop: 1 }}>
                        {outOfStock ? "Hết" : `Còn ${product.stockQuantity}`}
                    </div>
                </div>
            </button>
        );
    }
    return (
        <button onClick={() => !outOfStock && onAdd(product)} disabled={outOfStock} style={{
            background: outOfStock ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14,
            padding: 0, cursor: outOfStock ? "not-allowed" : "pointer",
            opacity: outOfStock ? 0.5 : 1, transition: "all 0.16s", overflow: "hidden",
            textAlign: "left", width: "100%"
        }}
            onMouseOver={e => !outOfStock && (e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)")}
            onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
        >
            <div style={{ aspectRatio: "4/3", overflow: "hidden", background: "#111" }}>
                <img src={product.imageUrl || `https://placehold.co/200x150/111/444?text=☕`} alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={e => { e.target.src = "https://placehold.co/200x150/111/444?text=☕"; }} />
            </div>
            <div style={{ padding: "10px 12px 12px" }}>
                <div style={{
                    color: "#f0ede6", fontWeight: 600, fontSize: 13, marginBottom: 4, lineHeight: 1.3,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                    {product.name}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 14 }}>{fmt(product.price)}</span>
                    <span style={{ fontSize: 10, color: outOfStock ? "#ef4444" : "#555" }}>
                        {outOfStock ? "Hết hàng" : `SL: ${product.stockQuantity}`}
                    </span>
                </div>
            </div>
        </button>
    );
}

function CartItem({ item, onUpdate, onRemove }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10
        }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#f0ede6", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                </div>
                <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, marginTop: 2 }}>
                    {fmt(item.price)} × {item.quantity} = {fmt(item.price * item.quantity)}
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <button onClick={() => onUpdate(item.id, item.quantity - 1)} style={{
                    width: 26, height: 26, borderRadius: 6, border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)", color: "#f0ede6", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}><Minus size={12} /></button>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: "center" }}>
                    {item.quantity}
                </span>
                <button onClick={() => onUpdate(item.id, item.quantity + 1)} style={{
                    width: 26, height: 26, borderRadius: 6, border: "1px solid rgba(245,158,11,0.4)",
                    background: "rgba(245,158,11,0.12)", color: "#f59e0b", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}><Plus size={12} /></button>
                <button onClick={() => onRemove(item.id)} style={{
                    width: 26, height: 26, borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.06)", color: "#ef4444", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2
                }}><Trash2 size={12} /></button>
            </div>
        </div>
    );
}

/* ─── Slide to Pay ───────────────────────────────────────────── */
function SlideToConfirm({ onConfirm, disabled, loading, success }) {
    const [pos, setPos] = useState(0);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef(null);
    const thumbRef = useRef(null);

    useEffect(() => { if (!dragging && !success) setPos(0); }, [dragging, success]);
    useEffect(() => { if (success) setPos(10000); }, [success]);

    const start = (e) => {
        if (disabled || loading || success) return;
        setDragging(true);
        e.preventDefault();
    };
    const move = useCallback((e) => {
        if (!dragging) return;
        const c = containerRef.current; const t = thumbRef.current;
        if (!c || !t) return;
        const r = c.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const max = r.width - t.offsetWidth;
        const np = Math.max(0, Math.min(clientX - r.left - t.offsetWidth / 2, max));
        setPos(np);
        if (np >= max * 0.92) { setDragging(false); onConfirm(); }
    }, [dragging, onConfirm]);
    const end = useCallback(() => { setDragging(false); }, []);

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", move); window.addEventListener("mouseup", end);
            window.addEventListener("touchmove", move); window.addEventListener("touchend", end);
        }
        return () => {
            window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", end);
            window.removeEventListener("touchmove", move); window.removeEventListener("touchend", end);
        };
    }, [dragging, move, end]);

    const max = containerRef.current && thumbRef.current
        ? containerRef.current.offsetWidth - thumbRef.current.offsetWidth : 1;
    const pct = success ? 100 : Math.min((pos / max) * 100, 100);

    return (
        <div ref={containerRef} style={{
            position: "relative", height: 56, borderRadius: 28,
            background: success ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)",
            border: `2px solid ${success ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.1)"}`,
            overflow: "hidden", userSelect: "none"
        }}>
            {/* fill */}
            <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${pct}%`, minWidth: 56,
                background: success ? "linear-gradient(90deg,#059669,#10b981)" : "linear-gradient(90deg,rgba(245,158,11,0.3),rgba(245,158,11,0.1))",
                transition: dragging ? "none" : "all 0.3s ease",
                borderRadius: 28
            }} />
            {/* label */}
            <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center",
                justifyContent: "center", pointerEvents: "none"
            }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: success ? "#d1fae5" : pct > 45 ? "#fff" : "rgba(255,255,255,0.35)" }}>
                    {success ? "✓ Đã xác nhận" : loading ? "Đang xử lý..." : "Kéo để xác nhận thanh toán →"}
                </span>
            </div>
            {/* thumb */}
            {!success && (
                <div ref={thumbRef}
                    onMouseDown={start} onTouchStart={start}
                    style={{
                        position: "absolute", left: 4, top: 4, bottom: 4, width: 48,
                        borderRadius: 24, cursor: disabled ? "not-allowed" : "grab",
                        background: disabled ? "#444" : "linear-gradient(135deg,#f59e0b,#d97706)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transform: `translateX(${pos}px)`,
                        transition: dragging ? "none" : "transform 0.3s cubic-bezier(.34,1.56,.64,1)",
                        boxShadow: "0 2px 12px rgba(245,158,11,0.5)", touchAction: "none"
                    }}>
                    {loading ? <Loader2 size={18} color="#fff" style={{ animation: "spin 1s linear infinite" }} /> : <ChevronRight size={20} color="#fff" />}
                </div>
            )}
            {success && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle2 size={24} color="#10b981" />
                </div>
            )}
        </div>
    );
}

/* ─── Payment Modal ─────────────────────────────────────────── */
function PaymentModal({ order, onClose, onSuccess, axiosInstance, displayName }) {
    const [method, setMethod] = useState("CASH");
    const [received, setReceived] = useState("");
    const [qrUrl, setQrUrl] = useState("");
    const [txId, setTxId] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const genQR = useCallback((m, o) => {
        const bank = "TPBANK", account = "0328778198", name = "COFFEE BLEND";
        let url = "";
        if (m === "MOMO") {
            url = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(`2|99|0328778198|||0|0|${o.total}|Don hang ${o.orderId}`)}`;
        } else {
            url = `https://img.vietqr.io/image/${bank}-${account}-compact2.png?amount=${o.total}&addInfo=Don%20${o.orderId}&accountName=${encodeURIComponent(name)}`;
        }
        setQrUrl(url);
        setTxId(`${m}_${Date.now()}`);
    }, []);

    const changeMethod = (m) => {
        setMethod(m); setQrUrl(""); setTxId("");
        if (["MOMO", "VNPAY", "PAYOS"].includes(m)) genQR(m, order);
    };

    const handleConfirm = async () => {
        if (method === "CASH") {
            const r = parseFloat(received);
            if (!r || r < order.total) { alert("Vui lòng nhập đủ số tiền khách đưa!"); return; }
        }
        if (processing || success) return;
        setProcessing(true);
        try {
            // Save bill
            await axiosInstance.post("/bills", {
                orderId: order.orderId,
                totalAmount: order.total,
                paymentMethod: method,
                paymentStatus: "PAID",
                transactionId: txId || `${method}_${Date.now()}`,
                issuedAt: new Date().toISOString(),
                notes: `Bàn ${order.table.number} - ${order.customer.name}\nNV: ${displayName}\nPT: ${METHOD_CONFIG[method]?.label}`
            }).catch(e => console.warn("Bill save failed:", e));

            // Update table to FREE
            await axiosInstance.put(`/tables/${order.table.id}`, {
                number: order.table.number,
                capacity: order.table.capacity,
                status: "FREE"
            }).catch(e => console.warn("Table update failed:", e));

            setSuccess(true);

            // Print bill
            const change = method === "CASH" ? parseFloat(received) - order.total : null;
            printBill(order, method, { received: parseFloat(received), change, txId, displayName, axiosInstance });

            setTimeout(() => {
                onSuccess();
            }, 1400);
        } catch (e) {
            alert("Lỗi xử lý thanh toán: " + e.message);
            setProcessing(false);
        }
    };

    const change = received && parseFloat(received) >= order.total
        ? parseFloat(received) - order.total : null;

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16
        }}>
            <div style={{
                background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
                width: "100%", maxWidth: 460, maxHeight: "92vh", display: "flex", flexDirection: "column",
                boxShadow: "0 32px 80px rgba(0,0,0,0.8)"
            }}>
                {/* Header */}
                <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                    <div>
                        <div style={{ color: "#f0ede6", fontWeight: 800, fontSize: 18 }}>Thanh toán đơn hàng</div>
                        <div style={{ color: "#666", fontSize: 12, marginTop: 2 }}>#{order.orderId} · Bàn {order.table.number}</div>
                    </div>
                    {!success && (
                        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                    {/* Amount */}
                    <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ color: "#888", fontSize: 12 }}>Tổng thanh toán</div>
                            <div style={{ color: "#f0ede6", fontSize: 13, marginTop: 2 }}>{order.customer.name} · {order.items.length} món</div>
                        </div>
                        <div style={{ color: "#f59e0b", fontWeight: 900, fontSize: 24 }}>{fmt(order.total)}</div>
                    </div>

                    {/* Payment methods */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                            Phương thức thanh toán
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {Object.entries(METHOD_CONFIG).map(([key, cfg]) => {
                                const Icon = cfg.icon;
                                const active = method === key;
                                return (
                                    <button key={key} onClick={() => changeMethod(key)} style={{
                                        display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                                        borderRadius: 12, border: `2px solid ${active ? cfg.color : "rgba(255,255,255,0.08)"}`,
                                        background: active ? cfg.bg : "rgba(255,255,255,0.03)", cursor: "pointer",
                                        transition: "all 0.15s"
                                    }}>
                                        <Icon size={18} color={active ? cfg.color : "#555"} />
                                        <span style={{ color: active ? cfg.color : "#888", fontWeight: active ? 700 : 500, fontSize: 13 }}>
                                            {cfg.label}
                                        </span>
                                        {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cash input */}
                    {method === "CASH" && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                                Tiền khách đưa
                            </label>
                            <input type="number" value={received} onChange={e => setReceived(e.target.value)}
                                placeholder="Nhập số tiền..." style={{
                                    width: "100%", background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.1)",
                                    borderRadius: 10, padding: "11px 14px", color: "#f0ede6", fontSize: 16, fontWeight: 700,
                                    outline: "none", boxSizing: "border-box",
                                    borderColor: received && parseFloat(received) >= order.total ? "#f59e0b" : "rgba(255,255,255,0.1)"
                                }} />
                            {/* Quick amounts */}
                            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                                {[order.total, Math.ceil(order.total / 50000) * 50000, Math.ceil(order.total / 100000) * 100000, Math.ceil(order.total / 500000) * 500000]
                                    .filter((v, i, a) => a.indexOf(v) === i && v >= order.total)
                                    .slice(0, 4)
                                    .map(v => (
                                        <button key={v} onClick={() => setReceived(String(v))} style={{
                                            padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(245,158,11,0.3)",
                                            background: "rgba(245,158,11,0.08)", color: "#f59e0b", fontSize: 11, fontWeight: 600, cursor: "pointer"
                                        }}>{(v / 1000).toFixed(0)}k</button>
                                    ))}
                            </div>
                            {change !== null && change >= 0 && (
                                <div style={{ marginTop: 10, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ color: "#6ee7b7", fontSize: 13, fontWeight: 600 }}>Tiền thối lại</span>
                                    <span style={{ color: "#10b981", fontSize: 18, fontWeight: 800 }}>{fmt(change)}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* QR */}
                    {["MOMO", "VNPAY", "PAYOS"].includes(method) && (
                        <div style={{ marginBottom: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
                            {qrUrl ? (
                                <>
                                    <div style={{ background: "#fff", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                                        <img src={qrUrl} alt="QR Code" style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block" }}
                                            onError={e => { e.target.src = "https://placehold.co/280x280/fff/999?text=QR+Error"; }} />
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                                            📱 Quét mã QR để thanh toán {fmt(order.total)}
                                        </div>
                                        <div style={{ color: "#555", fontSize: 11 }}>Mã GD: {txId}</div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: "center", padding: "24px 0" }}>
                                    <Loader2 size={32} color="#f59e0b" style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                                    <div style={{ color: "#888", fontSize: 13 }}>Đang tạo mã QR...</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer - Slide */}
                <div style={{ padding: "12px 20px 18px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                    <div style={{ color: "#555", fontSize: 11, textAlign: "center", marginBottom: 8 }}>
                        {success ? "🎉 Thanh toán hoàn tất!" : method === "CASH" ? "Nhập đủ tiền rồi kéo để xác nhận" : "Khách đã quét QR? Kéo để xác nhận nhận tiền"}
                    </div>
                    <SlideToConfirm
                        onConfirm={handleConfirm}
                        disabled={method === "CASH" && (!received || parseFloat(received) < order.total)}
                        loading={processing && !success}
                        success={success}
                    />
                </div>
            </div>
        </div>
    );
}

/* ─── Bills Modal ────────────────────────────────────────────── */
function BillsModal({ bills, loading, onClose }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
            <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, width: "100%", maxWidth: 600, maxHeight: "88vh", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ color: "#f0ede6", fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
                        <Receipt size={18} color="#f59e0b" /> Lịch sử hóa đơn
                    </div>
                    <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={16} />
                    </button>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <Loader2 size={32} color="#f59e0b" style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                            <div style={{ color: "#888" }}>Đang tải...</div>
                        </div>
                    ) : bills.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px 0", color: "#555" }}>
                            <Receipt size={48} style={{ margin: "0 auto 12px" }} />
                            <div>Chưa có hóa đơn nào</div>
                        </div>
                    ) : bills.map(b => {
                        const cfg = METHOD_CONFIG[b.paymentMethod] || METHOD_CONFIG.CASH;
                        const Icon = cfg.icon;
                        return (
                            <div key={b.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <div style={{ color: "#f0ede6", fontWeight: 700, fontSize: 14 }}>Hóa đơn #{b.id}</div>
                                        <div style={{ color: "#666", fontSize: 11, marginTop: 3 }}>{new Date(b.issuedAt || b.createdAt).toLocaleString("vi-VN")}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, color: cfg.color, fontSize: 12, fontWeight: 600 }}>
                                            <Icon size={12} /> {cfg.label}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 16 }}>{fmt(b.totalAmount)}</div>
                                        <div style={{
                                            marginTop: 4, padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                                            background: b.paymentStatus === "PAID" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                                            color: b.paymentStatus === "PAID" ? "#10b981" : "#f59e0b"
                                        }}>
                                            {b.paymentStatus === "PAID" ? "Đã thanh toán" : "Chờ TT"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ─── Print Bill ─────────────────────────────────────────────── */
async function printBill(order, method, info) {
    try {
        const { axiosInstance, displayName, change, received, txId } = info;
        let itemsHTML = "";
        try {
            const res = await axiosInstance.get(`/order-items/order/${order.orderId}`);
            const items = Array.isArray(res.data?.data || res.data) ? (res.data?.data || res.data) : order.items;
            itemsHTML = items.map((it, i) => {
                const name = it.productName || it.product?.name || it.name || "N/A";
                const qty = it.quantity || 0;
                const price = it.price || 0;
                return `<tr><td style="text-align:center;padding:8px">${i + 1}</td><td style="padding:8px">${name}</td><td style="text-align:center;padding:8px">${qty}</td><td style="text-align:right;padding:8px">${price.toLocaleString("vi-VN")}đ</td><td style="text-align:right;padding:8px;font-weight:700">${(qty * price).toLocaleString("vi-VN")}đ</td></tr>`;
            }).join("");
        } catch { itemsHTML = order.items.map((it, i) => `<tr><td style="text-align:center;padding:8px">${i + 1}</td><td style="padding:8px">${it.name}</td><td style="text-align:center;padding:8px">${it.quantity}</td><td style="text-align:right;padding:8px">${it.price?.toLocaleString("vi-VN")}đ</td><td style="text-align:right;padding:8px;font-weight:700">${(it.quantity * it.price).toLocaleString("vi-VN")}đ</td></tr>`).join(""); }

        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Hóa đơn #${order.orderId}</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#333}
.header{text-align:center;border-bottom:3px solid #d97706;padding-bottom:15px;margin-bottom:20px}
h1{color:#d97706;margin:0;font-size:28px}.subtitle{color:#666;font-size:16px;margin:6px 0 0}
.info{background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:20px}
.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #eee}
table{width:100%;border-collapse:collapse;margin-bottom:20px}
th{background:#d97706;color:#fff;padding:12px 8px;text-align:left}
td{padding:8px;border-bottom:1px solid #eee}
.total{background:#fff7ed;padding:16px;border-radius:10px;margin-bottom:20px;display:flex;justify-content:space-between;font-size:22px;font-weight:900;color:#d97706}
.payment{background:#ecfdf5;border:2px solid #10b981;border-radius:10px;padding:16px;margin-bottom:20px}
.payment h3{color:#059669;margin:0 0 10px}
.footer{text-align:center;border-top:2px solid #d97706;padding-top:16px;color:#666}
.btn-row{text-align:center;margin-top:24px}
button{padding:12px 32px;font-size:15px;font-weight:700;border-radius:8px;border:none;cursor:pointer;margin:0 6px}
.print-btn{background:#d97706;color:#fff}
.close-btn{background:#6b7280;color:#fff}
@media print{.btn-row{display:none}}</style></head>
<body><div class="header"><h1>☕ COFFEE BLEND</h1><div class="subtitle">HÓA ĐƠN THANH TOÁN</div></div>
<div class="info">
<div class="row"><span>Mã đơn:</span><span><b>#${order.orderId}</b></span></div>
<div class="row"><span>Thời gian:</span><span>${new Date().toLocaleString("vi-VN")}</span></div>
<div class="row"><span>Bàn:</span><span>Bàn ${order.table.number}</span></div>
<div class="row"><span>Khách hàng:</span><span>${order.customer.name}</span></div>
<div class="row"><span>Nhân viên:</span><span>${displayName}</span></div>
</div>
<table><thead><tr><th style="width:40px;text-align:center">STT</th><th>Tên món</th><th style="width:60px;text-align:center">SL</th><th style="width:110px;text-align:right">Đơn giá</th><th style="width:120px;text-align:right">Thành tiền</th></tr></thead>
<tbody>${itemsHTML}</tbody></table>
<div class="total"><span>TỔNG CỘNG</span><span>${order.total.toLocaleString("vi-VN")}đ</span></div>
<div class="payment"><h3>✓ Thông tin thanh toán</h3>
<div class="row"><span>Phương thức:</span><span><b>${METHOD_CONFIG[method]?.label || method}</b></span></div>
<div class="row"><span>Trạng thái:</span><span style="color:#059669;font-weight:700">✓ Đã thanh toán</span></div>
${method === "CASH" ? `<div class="row"><span>Tiền nhận:</span><span>${received?.toLocaleString("vi-VN")}đ</span></div><div class="row"><span>Tiền thối:</span><span style="color:#059669;font-weight:700;font-size:18px">${change?.toLocaleString("vi-VN")}đ</span></div>` : `<div class="row"><span>Mã GD:</span><span><code style="background:#f3f4f6;padding:2px 6px;border-radius:4px">${txId}</code></span></div>`}
</div>
<div class="footer"><p style="font-size:16px;font-weight:700;color:#d97706">Cảm ơn quý khách! ☕</p><p>COFFEE BLEND - Hotline: 1900 xxxx</p></div>
<div class="btn-row"><button class="print-btn" onclick="window.print()">🖨️ In hóa đơn</button><button class="close-btn" onclick="window.close()">✕ Đóng</button></div>
</body></html>`;

        const w = window.open("", "_blank");
        if (w) { w.document.write(html); w.document.close(); }
        else {
            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `HoaDon_${order.orderId}.html`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    } catch (e) { console.error("Print error:", e); }
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function StaffPage() {
    const navigate = useNavigate();
    const { staffUser: user, logout, products: ctxProducts, tables: ctxTables, cart, addToCart,
        updateQuantity, removeFromCart, clearCart, cartTotal, axiosInstance } = useAppContext();

    const displayName = user?.userDetails?.fullName || user?.userName || "Nhân viên";

    const [products, setProducts] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Tất cả");
    const [viewMode, setViewMode] = useState("grid");
    const [loadingTables, setLoadingTables] = useState(false);
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [pendingOrder, setPendingOrder] = useState(null);
    const [showBills, setShowBills] = useState(false);
    const [bills, setBills] = useState([]);
    const [loadingBills, setLoadingBills] = useState(false);
    const [notification, setNotification] = useState(null);

    const notify = (msg, type = "success") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 2200);
    };

    const fetchTables = useCallback(async () => {
        setLoadingTables(true);
        try {
            const res = await axiosInstance.get("/tables");
            const d = res.data?.data || res.data;
            setTables(Array.isArray(d) ? d : []);
        } catch (e) {
            console.error(e);
            if (e.response?.status === 401) { logout("ROLE_STAFF"); navigate("/staff/login"); }
        } finally { setLoadingTables(false); }
    }, [axiosInstance, logout, navigate]);

    const fetchBills = useCallback(async () => {
        setLoadingBills(true);
        try {
            const res = await axiosInstance.get("/bills");
            const d = res.data?.data || res.data;
            const list = Array.isArray(d) ? d : [];
            list.sort((a, b) => new Date(b.issuedAt || b.createdAt) - new Date(a.issuedAt || a.createdAt));
            setBills(list);
        } catch (e) { console.error(e); } finally { setLoadingBills(false); }
    }, [axiosInstance]);

    useEffect(() => {
        setProducts(ctxProducts || []);
        if (ctxTables?.length > 0) setTables(ctxTables);
        else fetchTables();
    }, [ctxProducts, ctxTables, fetchTables]);

    const handleAddToCart = (p) => {
        addToCart(p);
        notify(`✓ ${p.name}`);
    };
    const handleUpdateQty = (id, qty) => {
        if (qty <= 0) removeFromCart(id); else updateQuantity(id, qty);
    };

    const handleCreateOrder = async () => {
        if (!selectedTable) { notify("Chưa chọn bàn!", "error"); return; }
        if (cart.length === 0) { notify("Giỏ hàng trống!", "error"); return; }
        if (selectedTable.status !== "FREE") { notify("Bàn này đang bận!", "error"); return; }
        setCreatingOrder(true);
        try {
            const orderRes = await axiosInstance.post("/orders", {
                tableId: selectedTable.id, totalAmount: cartTotal, status: "PENDING",
                customerName: customerName.trim() || "Khách lẻ",
                notes: `Nhân viên: ${displayName}`
            });
            const order = orderRes.data?.data || orderRes.data;
            if (!order?.id) throw new Error("Server không trả về ID đơn hàng");

            for (const item of cart) {
                await axiosInstance.post("/order-items", { orderId: order.id, productId: item.id, quantity: item.quantity, price: item.price });
            }
            await axiosInstance.put(`/tables/${selectedTable.id}`, { number: selectedTable.number, capacity: selectedTable.capacity, status: "OCCUPIED" });

            setPendingOrder({ orderId: order.id, table: { ...selectedTable }, customer: { name: customerName || "Khách lẻ" }, items: [...cart], total: cartTotal });
        } catch (e) {
            notify("Lỗi tạo đơn: " + (e.response?.data?.message || e.message), "error");
            fetchTables();
        } finally { setCreatingOrder(false); }
    };

    const handlePaymentSuccess = () => {
        clearCart(); setSelectedTable(null); setCustomerName("");
        setPendingOrder(null); fetchTables();
        notify("🎉 Thanh toán thành công!");
    };

    const handleCancelPayment = async () => {
        if (!window.confirm("Hủy thanh toán? Đơn hàng và bàn sẽ được hoàn tác.")) return;
        try {
            if (pendingOrder?.orderId) await axiosInstance.delete(`/orders/${pendingOrder.orderId}`).catch(() => { });
            if (pendingOrder?.table?.id) await axiosInstance.put(`/tables/${pendingOrder.table.id}`, { number: pendingOrder.table.number, capacity: pendingOrder.table.capacity, status: "FREE" }).catch(() => { });
        } catch (e) { console.error(e); }
        setPendingOrder(null); clearCart(); setSelectedTable(null); setCustomerName(""); fetchTables();
    };

    const handleLogout = () => { if (!window.confirm("Đăng xuất?")) return; logout("ROLE_STAFF"); navigate("/staff/login"); };

    const categories = ["Tất cả", ...new Set(products.map(p => p.category?.name).filter(Boolean))];
    const filtered = products.filter(p => {
        const ms = p.name?.toLowerCase().includes(search.toLowerCase());
        const mc = category === "Tất cả" || p.category?.name === category;
        return ms && mc;
    });

    const freeTables = tables.filter(t => t.status === "FREE").length;
    const occupiedTables = tables.filter(t => t.status !== "FREE").length;

    return (
        <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", fontFamily: "'Inter','DM Sans',sans-serif" }}>
            {/* ── Notification ── */}
            {notification && (
                <div style={{
                    position: "fixed", top: 20, right: 20, zIndex: 200,
                    background: notification.type === "error" ? "#1a0505" : "#051a0d",
                    border: `1px solid ${notification.type === "error" ? "#ef4444" : "#10b981"}`,
                    borderLeft: `4px solid ${notification.type === "error" ? "#ef4444" : "#10b981"}`,
                    borderRadius: 10, padding: "12px 16px", color: "#f0ede6", fontSize: 13, fontWeight: 600,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)", animation: "slideInRight 0.2s ease",
                    maxWidth: 280
                }}>
                    {notification.msg}
                </div>
            )}

            {/* ── LEFT: Product Menu ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
                {/* Top bar */}
                <div style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Coffee size={22} color="#f59e0b" />
                        <div>
                            <div style={{ color: "#f0ede6", fontWeight: 800, fontSize: 15, lineHeight: 1 }}>Coffee Blend POS</div>
                            <div style={{ color: "#555", fontSize: 11, marginTop: 1 }}>Xin chào, {displayName}</div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
                        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                            <span style={{ color: "#10b981", fontSize: 12, fontWeight: 700 }}>{freeTables} trống</span>
                        </div>
                        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
                            <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 700 }}>{occupiedTables} bận</span>
                        </div>
                    </div>

                    <button onClick={() => { setShowBills(true); fetchBills(); }} style={{
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8, padding: "7px 12px", color: "#888", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600
                    }}>
                        <Receipt size={14} /> Hóa đơn
                    </button>
                    <button onClick={handleLogout} style={{
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: 8, padding: "7px 12px", color: "#ef4444", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600
                    }}>
                        <LogOut size={14} /> Đăng xuất
                    </button>
                </div>

                {/* Search & filters */}
                <div style={{ background: "#111", padding: "12px 20px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                        <div style={{ flex: 1, position: "relative" }}>
                            <Search size={15} color="#555" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Tìm tên món..." style={{
                                    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 10, padding: "9px 12px 9px 36px", color: "#f0ede6", fontSize: 13, outline: "none",
                                    boxSizing: "border-box"
                                }} />
                        </div>
                        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 3 }}>
                            <button onClick={() => setViewMode("grid")} style={{ width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer", background: viewMode === "grid" ? "#f59e0b" : "transparent", color: viewMode === "grid" ? "#fff" : "#555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Grid3X3 size={14} />
                            </button>
                            <button onClick={() => setViewMode("list")} style={{ width: 30, height: 30, borderRadius: 8, border: "none", cursor: "pointer", background: viewMode === "list" ? "#f59e0b" : "transparent", color: viewMode === "list" ? "#fff" : "#555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <List size={14} />
                            </button>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
                        {categories.map(c => (
                            <button key={c} onClick={() => setCategory(c)} style={{
                                padding: "5px 12px", borderRadius: 20, border: `1px solid ${category === c ? "#f59e0b" : "rgba(255,255,255,0.08)"}`,
                                background: category === c ? "rgba(245,158,11,0.15)" : "transparent",
                                color: category === c ? "#f59e0b" : "#666", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                whiteSpace: "nowrap", transition: "all 0.15s"
                            }}>{c}</button>
                        ))}
                    </div>
                </div>

                {/* Products grid */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>
                            <Package size={48} style={{ margin: "0 auto 12px" }} />
                            <div>Không tìm thấy sản phẩm</div>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
                            {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={handleAddToCart} viewMode="grid" />)}
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={handleAddToCart} viewMode="list" />)}
                        </div>
                    )}
                </div>
            </div>

            {/* ── RIGHT: Tables + Cart ── */}
            <div style={{ width: 360, background: "#111", borderLeft: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", height: "100vh" }}>
                {/* Tables section */}
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "4px 16px 0", flexShrink: 0 }}>
                    <TableGrid tables={tables} selected={selectedTable} onSelect={setSelectedTable} loading={loadingTables} onRefresh={fetchTables} />
                    {selectedTable && (
                        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                                <Hash size={13} /> Bàn {selectedTable.number} đã chọn
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <User size={13} color="#666" />
                                <input placeholder="Tên khách (tùy chọn)" value={customerName} onChange={e => setCustomerName(e.target.value)}
                                    style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px", color: "#f0ede6", fontSize: 12, outline: "none" }} />
                                <button onClick={() => { setSelectedTable(null); setCustomerName(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: 0 }}>
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cart */}
                <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <ShoppingCart size={16} color="#f59e0b" />
                        <span style={{ color: "#f0ede6", fontWeight: 700, fontSize: 13 }}>Đơn hàng</span>
                        {cart.length > 0 && (
                            <span style={{ background: "#f59e0b", color: "#000", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 800, marginLeft: 2 }}>{cart.length}</span>
                        )}
                        {cart.length > 0 && (
                            <button onClick={clearCart} style={{ marginLeft: "auto", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Xóa tất cả</button>
                        )}
                    </div>

                    {cart.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "32px 0", color: "#444" }}>
                            <ShoppingCart size={36} style={{ margin: "0 auto 10px" }} />
                            <div style={{ fontSize: 13 }}>Chưa có món nào</div>
                            <div style={{ fontSize: 11, marginTop: 4, color: "#333" }}>Chọn bàn và thêm món từ menu</div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {cart.map(item => (
                                <CartItem key={item.id} item={item} onUpdate={handleUpdateQty} onRemove={removeFromCart} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom: total + order button */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "14px 16px", flexShrink: 0 }}>
                    {/* Summary */}
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: 12, marginBottom: 4 }}>
                            <span>Số món:</span><span>{cart.reduce((s, i) => s + i.quantity, 0)} món</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#f0ede6", fontWeight: 700, fontSize: 14 }}>Tổng cộng</span>
                            <span style={{ color: "#f59e0b", fontWeight: 900, fontSize: 22 }}>{fmt(cartTotal)}</span>
                        </div>
                    </div>

                    {/* Validation hints */}
                    {(!selectedTable || cart.length === 0) && (
                        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "8px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                            <AlertCircle size={13} color="#ef4444" />
                            <span style={{ color: "#f87171", fontSize: 12 }}>
                                {!selectedTable && cart.length === 0 ? "Chọn bàn & thêm món" : !selectedTable ? "Chưa chọn bàn" : "Giỏ hàng trống"}
                            </span>
                        </div>
                    )}

                    <button onClick={handleCreateOrder}
                        disabled={creatingOrder || cart.length === 0 || !selectedTable}
                        style={{
                            width: "100%", padding: "15px", borderRadius: 12, border: "none", cursor: cart.length > 0 && selectedTable ? "pointer" : "not-allowed",
                            background: cart.length > 0 && selectedTable ? "linear-gradient(135deg,#f59e0b,#d97706)" : "#1f1f1f",
                            color: cart.length > 0 && selectedTable ? "#000" : "#444",
                            fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            transition: "all 0.2s", boxShadow: cart.length > 0 && selectedTable ? "0 4px 20px rgba(245,158,11,0.35)" : "none"
                        }}>
                        {creatingOrder ? (
                            <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Đang tạo đơn...</>
                        ) : (
                            <><Zap size={16} /> Tạo đơn & Thanh toán</>
                        )}
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            {pendingOrder && (
                <PaymentModal
                    order={pendingOrder}
                    onClose={handleCancelPayment}
                    onSuccess={handlePaymentSuccess}
                    axiosInstance={axiosInstance}
                    displayName={displayName}
                />
            )}

            {/* Bills Modal */}
            {showBills && (
                <BillsModal bills={bills} loading={loadingBills} onClose={() => setShowBills(false)} />
            )}

            <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes slideInRight { from { transform: translateX(40px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        input::placeholder { color: #444; }
        * { box-sizing: border-box; }
      `}</style>
        </div>
    );
}