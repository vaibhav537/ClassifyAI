import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("caseId");

    if (!caseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Support case ID is required.",
        },
        { status: 400 },
      );
    }

    const supportCase = await prisma.supportCase.findUnique({
      where: {
        id: caseId,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                phone: true,
                branch: true,
                semester: true,
                year: true,
              },
            },
            semester: {
              select: {
                id: true,
                name: true,
                number: true,
              },
            },
            section: {
              select: {
                id: true,
                name: true,
              },
            },
            riskProfile: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
          },
        },
        assignedTeacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        assignedAssistant: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true,
          },
        },
        riskEvent: {
          include: {
            rule: {
              select: {
                id: true,
                name: true,
                description: true,
                type: true,
                threshold: true,
                severity: true,
              },
            },
            classSession: {
              select: {
                id: true,
                date: true,
                startTime: true,
                endTime: true,
                room: true,
                status: true,
                subjectRel: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
                semesterRel: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                sectionRel: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                teacher: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        circleOfCareGroup: {
          include: {
            conversation: {
              include: {
                participants: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        avatarUrl: true,
                      },
                    },
                  },
                  orderBy: {
                    joinedAt: "asc",
                  },
                },
              },
            },
          },
        },
        notes: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
              },
            },
          },
        },
        activityLogs: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            actor: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!supportCase) {
      return NextResponse.json(
        {
          success: false,
          message: "Support case not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: supportCase,
    });
  } catch (error) {
    console.error("Error fetching support case detail:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch support case detail.",
      },
      { status: 500 },
    );
  }
}
