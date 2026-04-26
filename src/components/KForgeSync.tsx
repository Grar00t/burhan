
import React, { useEffect, useState } from 'react';
import Gun from 'gun';

const gun = Gun({ peers: ['http://localhost:3000/gun'] });

export const KForgeSync = () => {
    const [commits, setCommits] = useState<any[]>([]);

    useEffect(() => {
        const repo = gun.get('kforge/repo');
        
        repo.map().on((commit, id) => {
            if (commit) {
                setCommits(prev => [...prev.filter(c => c.id !== id), { ...commit, id }]);
            }
        });

        return () => {
            repo.off();
        };
    }, []);

    const broadcastUpdate = (msg: string) => {
        gun.get('kforge/repo').set({ msg, timestamp: Date.now() });
    };

    return (
        <div className="p-4 space-y-4 font-mono">
            <h3 className="text-blue-400">KForge Distributed Ledger</h3>
            <button onClick={() => broadcastUpdate('New commit: ' + Math.random().toString(36).substring(7))} className="px-3 py-1 bg-blue-500/20 rounded text-xs">Broadcast Commit</button>
            <div className="space-y-1">
                {commits.map(c => <div key={c.id} className="text-xs text-white/50">{c.msg}</div>)}
            </div>
        </div>
    );
};
export default KForgeSync;
