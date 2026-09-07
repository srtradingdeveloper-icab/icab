const POSTS = [
  { id: 1, name: 'Priya S.', initials: 'PS', caption: 'Amazing Puri trip with i Cab! Driver was super professional, arrived 10 mins early. Highly recommend the Innova for a family of 5 🏖️', destination: 'Puri', emoji: '🏖️', likes: 24, time: '2 days ago', color: 'bg-pink-100 text-pink-700' },
  { id: 2, name: 'Raju M.', initials: 'RM', caption: 'Monthly office pass has saved me ₹4,000 this month alone. The driver is always on time for my Cuttack commute. Best decision ever!', destination: 'Cuttack', emoji: '💼', likes: 31, time: '4 days ago', color: 'bg-blue-100 text-blue-700' },
  { id: 3, name: 'Asha P.', initials: 'AP', caption: 'Chilika lake trip was magical! Booked Ertiga for 6 people. The agent sorted everything in under 30 mins. i Cab keeps its promises 🐬', destination: 'Chilika Lake', emoji: '🐬', likes: 18, time: '1 week ago', color: 'bg-teal-100 text-teal-700' },
]

export default function CommunityPreview() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {POSTS.map(p => (
        <div key={p.id} className="bg-white rounded-2xl p-6 border border-black/5 hover:shadow-md transition-shadow">
          {/* Author */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${p.color}`}>
              {p.initials}
            </div>
            <div>
              <div className="font-bold text-sm">{p.name}</div>
              <div className="text-xs text-black/40">{p.time}</div>
            </div>
            <span className="ml-auto text-2xl">{p.emoji}</span>
          </div>
          {/* Caption */}
          <p className="text-sm text-black/70 leading-relaxed mb-4">{p.caption}</p>
          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs bg-black/5 px-2.5 py-1 rounded-full font-medium text-black/50">📍 {p.destination}</span>
            <span className="text-xs text-black/40 flex items-center gap-1">❤️ {p.likes}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
