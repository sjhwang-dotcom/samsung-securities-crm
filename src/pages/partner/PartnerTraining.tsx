import {
  Clock, CheckCircle, Play, Lock, Award, Star,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '../../components/ui'

interface Course {
  id: number
  title: string
  description: string
  duration: string
  progress: number
  status: 'Completed' | 'In Progress' | 'Not Started'
  modules: number
  completedModules: number
}

const courses: Course[] = [
  {
    id: 1, title: 'Getting Started with Harlow', description: 'Learn the basics of the Harlow platform, partner tools, and how to submit your first lead.',
    duration: '45 min', progress: 100, status: 'Completed', modules: 5, completedModules: 5,
  },
  {
    id: 2, title: 'Products & Services Overview', description: 'Deep dive into Harlow payment products, POS terminals, e-commerce solutions, and value-added services.',
    duration: '1.5 hrs', progress: 100, status: 'Completed', modules: 8, completedModules: 8,
  },
  {
    id: 3, title: 'Compliance & Regulations', description: 'PCI DSS requirements, KYC/AML procedures, and how to ensure merchant compliance from day one.',
    duration: '1 hr', progress: 60, status: 'In Progress', modules: 6, completedModules: 4,
  },
  {
    id: 4, title: 'Sales Techniques & Objection Handling', description: 'Proven strategies for merchant acquisition, handling objections, and closing deals effectively.',
    duration: '2 hrs', progress: 0, status: 'Not Started', modules: 10, completedModules: 0,
  },
  {
    id: 5, title: 'Advanced Pricing & Interchange', description: 'Master interchange optimization, tiered vs. IC+ pricing, and how to structure competitive proposals.',
    duration: '2.5 hrs', progress: 0, status: 'Not Started', modules: 12, completedModules: 0,
  },
]

interface Cert {
  name: string
  earned: string
  icon: typeof Award
  color: string
}

const certifications: Cert[] = [
  { name: 'Harlow Certified Partner', earned: 'Oct 15, 2024', icon: Award, color: '#10B981' },
  { name: 'Products Specialist', earned: 'Nov 22, 2024', icon: Star, color: '#3B82F6' },
]

const statusVariant: Record<string, 'emerald' | 'amber' | 'gray'> = {
  'Completed': 'emerald',
  'In Progress': 'amber',
  'Not Started': 'gray',
}

export default function PartnerTraining() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={18} color="#059669" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>2 of 5</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Courses Completed</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Clock size={18} color="#D97706" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>4.5 hrs</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Remaining</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Award size={18} color="#7C3AED" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>2</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>Certifications Earned</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Course List */}
      <Card>
        <CardHeader title="Training Modules" subtitle="Complete all modules to earn full certification" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
          {courses.map((course, i) => (
            <div key={course.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0',
              borderBottom: i < courses.length - 1 ? '1px solid #F1F5F9' : 'none',
            }}>
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: course.status === 'Completed'
                  ? 'linear-gradient(135deg, #10B981, #059669)'
                  : course.status === 'In Progress'
                    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                    : '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {course.status === 'Completed' ? (
                  <CheckCircle size={18} color="white" strokeWidth={2} />
                ) : course.status === 'In Progress' ? (
                  <Play size={18} color="white" strokeWidth={2} />
                ) : (
                  <Lock size={18} color="#94A3B8" strokeWidth={2} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{course.title}</span>
                  <StatusBadge variant={statusVariant[course.status]}>{course.status}</StatusBadge>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 8px', lineHeight: 1.5 }}>{course.description}</p>

                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden',
                    maxWidth: 200,
                  }}>
                    <div style={{
                      width: `${course.progress}%`, height: '100%', borderRadius: 3,
                      background: course.progress === 100 ? '#10B981' : course.progress > 0 ? '#F59E0B' : '#E5E7EB',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>
                    {course.completedModules}/{course.modules} modules
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <Clock size={12} color="#94A3B8" />
                <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{course.duration}</span>
              </div>

              {/* Action */}
              <button style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                flexShrink: 0,
                background: course.status === 'Completed' ? '#F1F5F9' : course.status === 'In Progress' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #10B981, #059669)',
                color: course.status === 'Completed' ? '#94A3B8' : 'white',
                border: 'none',
              }}>
                {course.status === 'Completed' ? 'Review' : course.status === 'In Progress' ? 'Continue' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader title="Certifications" subtitle="Badges earned from completed training" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
          {certifications.map((cert, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: 16,
              background: '#FAFBFC', borderRadius: 12, border: '1px solid #F1F5F9',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `linear-gradient(135deg, ${cert.color}20, ${cert.color}10)`,
                border: `2px solid ${cert.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <cert.icon size={22} color={cert.color} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{cert.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Earned {cert.earned}</div>
              </div>
              <StatusBadge variant="emerald">Verified</StatusBadge>
            </div>
          ))}

          {/* Locked cert */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: 16,
            background: '#FAFBFC', borderRadius: 12, border: '1px dashed #E5E7EB', opacity: 0.6,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: '#F1F5F9', border: '2px dashed #CBD5E1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={22} color="#94A3B8" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748B' }}>Compliance Expert</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Complete Compliance course</div>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: 16,
            background: '#FAFBFC', borderRadius: 12, border: '1px dashed #E5E7EB', opacity: 0.6,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: '#F1F5F9', border: '2px dashed #CBD5E1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock size={22} color="#94A3B8" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748B' }}>Sales Master</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Complete all 5 courses</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
